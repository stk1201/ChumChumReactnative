//
//  Mediapipe.swift
//  ChumChumEvaluation
//
//  Created by Satoko Fujiyoshi on 2024/10/19.
//
import Foundation
import MediaPipeTasksVision
import AVFoundation

@objc(Mediapipe)
class Mediapipe: NSObject {
  
  private func createModel() -> PoseLandmarker? {
    guard let modelPath = Bundle.main.path(forResource: "pose_landmarker_heavy", ofType: "task") else {
      print("モデルファイルが見つかりません")
      return nil
    }
    
    let options = PoseLandmarkerOptions()
    options.baseOptions.modelAssetPath = modelPath
    options.runningMode = .video
    options.minPoseDetectionConfidence = 0.5
    options.minPosePresenceConfidence = 0.5
    options.minTrackingConfidence = 0.5
    options.numPoses = 1
    
    do {
      let poseLandmarkerModel = try PoseLandmarker(options: options)
      
      return poseLandmarkerModel
    } catch {
      print("モデル作成中にエラーが発生しました: \(error)")
      return nil
    }
  }
  
  //ポーズ推定
  private func detect(videoPath: String, completion: @escaping (Result<([PoseLandmarkerResult], [String]), Error>) -> Void){
    // 動画パスのチェック
    if videoPath.isEmpty {
     return
    }
    
    // モデルの作成
    guard let poseLandmarkerModel = createModel() else {
      completion(.failure(NSError(domain: "Failed to create model", code: -1, userInfo: nil)))
      return
    }
    
    let videoURL = URL(fileURLWithPath: videoPath)
    let asset = AVAsset(url: videoURL)
    
    // 動画の総フレーム数を取得する
    guard let videoTrack = asset.tracks(withMediaType: .video).first else {
      completion(.failure(NSError(domain: "No Video Track", code: -1, userInfo: nil)))
      return
    }

    let duration: Double = CMTimeGetSeconds(asset.duration) * 1000 //ms
    let interval: Double = 1000.0 //ms, = 1sec
    let frameCount = Int(duration/interval)
    //let frameInterval = CMTime(value: 1, timescale: CMTimeScale(fps))
    
    // AVAssetImageGeneratorを使用してフレームを非同期に取得
    let imageGenerator = AVAssetImageGenerator(asset: asset)
    imageGenerator.appliesPreferredTrackTransform = true // フレームの向きを調整
    //タイムスタンプの許容範囲
    let tolerance = CMTime(value: 1, timescale: 25)
    imageGenerator.requestedTimeToleranceBefore = tolerance
    imageGenerator.requestedTimeToleranceAfter = tolerance
    
    var results = [PoseLandmarkerResult]()
    var imageData: [String] = []

    // 各フレームのタイムスタンプを作成する
    var times = [NSValue]()
    for i in 0..<frameCount {//in stride(from: 0.0, to:  CMTimeGetSeconds(duration), by: interval) {
      let timeStamp = Int(interval) * i //ms
      let image: CGImage
      
      do{
        let time = CMTime(value: Int64(timeStamp), timescale: 1000)
        image = try imageGenerator.copyCGImage(at: time, actualTime: nil)
        
      } catch{
        completion(.failure(error))
        return
      }

      
      let uiImage = UIImage(cgImage: image)
      
      do {
        let result = try poseLandmarkerModel.detect(videoFrame: MPImage(uiImage: uiImage), timestampInMilliseconds: timeStamp)
        results.append(result)
        
        //描画
        let markEachFrame = MarkEachFrame()
        guard let drawUIImage = markEachFrame.draw(image: image, resultLandmark: result.landmarks) else {
          completion(.failure(NSError(domain: "Image Error", code: -1, userInfo: nil)))
          return
        }
        
        if let drawImageData = drawUIImage.jpegData(compressionQuality: 1.0) {
          // Base64 エンコード
          let base64String = drawImageData.base64EncodedString()
          imageData.append(base64String)
        }
        
      } catch {
        completion(.failure(NSError(domain: "Failed to Detection", code: -1, userInfo: nil)))
        return
      }
    }
    
    completion(.success((results, imageData)))
  }
  
  
  @objc(poseEstimation:originalVideoPath:resolver:rejecter:)
  func poseEstimation(userVideoPath: String, originalVideoPath: String, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
    var userResults = [PoseLandmarkerResult]()
    var userImageData = [String]()
    var originalResults = [PoseLandmarkerResult]()
    var originalImageData = [String]()
    
    let dispatchGroup = DispatchGroup()
    
    dispatchGroup.enter()
    detect(videoPath: userVideoPath) { results in
      switch results {
        case .success(let (results, imageData)):
          userResults = results
          userImageData = imageData
        case .failure(let error):
        rejecter("PoseEstimate Result Error", "ユーザの結果が得られませんでした：\(error.localizedDescription)", error)
      }
      dispatchGroup.leave()
    }
  
    dispatchGroup.enter()
    detect(videoPath: originalVideoPath) { results in
      switch results {
        case .success(let (results, imageData)):
          originalResults = results
          originalImageData = imageData
        case .failure(let error):
        rejecter("PoseEstimate Result Error", "オリジナルの結果が得られませんでした：\(error.localizedDescription)", error)
      }
      dispatchGroup.leave()
    }
    dispatchGroup.notify(queue: .main) {
      //スコアリング
      let scoreCalculating = ScoreCalculating()
      scoreCalculating.setPoseLandmarkerResultList(userResult: userResults, originalResult: originalResults)
      var eachTimeScore = scoreCalculating.scoring()
      
      // 結果を JSON 形式にまとめる
      let allResult: [String: Any] = [
          "eachTimeScore": eachTimeScore,
          "userImageData": userImageData,
          "originalImageData": originalImageData
      ]
          
      resolver(allResult)
    }
  }
  
  
  @objc
  static func requiresMainQueueSetup() -> Bool {
      return true
  }
}
