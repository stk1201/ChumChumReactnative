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
  
  private func imageGenerator(with videoAsset: AVAsset) -> AVAssetImageGenerator{
    let generator = AVAssetImageGenerator(asset: videoAsset)
    generator.requestedTimeToleranceBefore = CMTimeMake(value: 1, timescale: 25)
    generator.requestedTimeToleranceAfter = CMTimeMake(value: 1, timescale: 25)
    generator.appliesPreferredTrackTransform = true

    return generator
  }
  
  //ポーズ推定
  private func detect(videoPath: String, completion: @escaping (Result<[PoseLandmarkerResult], Error>) -> Void){
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
      } catch {
        completion(.failure(NSError(domain: "Failed to Detection", code: -1, userInfo: nil)))
        return
      }
    }
    
    completion(.success(results))
    
  }
  
  
  @objc(poseEstimation:originalVideoPath:resolver:rejecter:)
  func poseEstimation(userVideoPath: String, originalVideoPath: String, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
    var userResults = [PoseLandmarkerResult]()
    var originalResults = [PoseLandmarkerResult]()
    
    let dispatchGroup = DispatchGroup()
    
    dispatchGroup.enter()
    detect(videoPath: userVideoPath) { results in
      switch results {
        case .success(let results):
        userResults = results
        case .failure(let error):
        rejecter("PoseEstimate Result Error", "ユーザの結果が得られませんでした：\(error.localizedDescription)", error)
      }
      dispatchGroup.leave()
    }
    
    dispatchGroup.enter()
    detect(videoPath: originalVideoPath) { results in
      switch results {
        case .success(let results):
        originalResults = results
        case .failure(let error):
        rejecter("PoseEstimate Result Error", "オリジナルの結果が得られませんでした：\(error.localizedDescription)", error)
      }
      dispatchGroup.leave()
    }
    dispatchGroup.notify(queue: .main) {
      // ここで結果を返すためにJSON形式に変換
      if !userResults.isEmpty && !originalResults.isEmpty {
        let userJSON = userResults.map { $0.toJSON() }
        let originalJSON = originalResults.map { $0.toJSON() }
        
        let combinedResults: [String: Any] = [
          "userResults": userJSON,
          "originalResults": originalJSON
        ]
        
        resolver(combinedResults)//結果をReactNativeに返す
      }
    }
  }
  
  @objc
  static func requiresMainQueueSetup() -> Bool {
    return true
  }
}

// `PoseLandmarkerResult`をJSON形式に変換する拡張メソッド
extension PoseLandmarkerResult {
  func toJSON() -> [String: Any] {
    // landmarks を [NormalizedLandmark] 型として扱い、それぞれの座標にアクセスする
    let landmarksArray = self.landmarks.map { landmark in
      return [
        "x": landmark[0].x,
        "y": landmark[0].y,
        "z": landmark[0].z
      ]
    }

    return [
      "landmarks": landmarksArray
    ]
  }
}
