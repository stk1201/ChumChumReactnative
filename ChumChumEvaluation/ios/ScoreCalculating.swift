//
//  ScoreCalculating.swift
//  ChumChumEvaluation
//
//  Created by Satoko Fujiyoshi on 2024/10/23.
//

import Foundation
import MediaPipeTasksVision

class ScoreCalculating{
  private var userResult: [PoseLandmarkerResult] = []
  private var originalResult: [PoseLandmarkerResult] = []
  // 基準点
  private let basePoints = [11, 12, 23, 24]
  // 基準点以外で使用する座標
  private let measurePoints = [13, 15, 17, 19, 21, 25, 27, 29, 31, 7, 8, 14, 16, 18, 20, 22, 26, 28, 30, 32]
  
  //結果の取得
  public func setPoseLandmarkerResultList(userResult: [PoseLandmarkerResult], originalResult: [PoseLandmarkerResult]) {
       self.userResult = userResult
       self.originalResult = originalResult
   }
  
  private func calculateVector(coordinate: [PoseLandmarkerResult], basePoint: Int, measurePoint: Int, vector: inout [[[[Float]]]]) {
      for t in 0..<coordinate.count {
        let measurePointX = coordinate[t].landmarks[0][measurePoint].x
          let measurePointY = coordinate[t].landmarks[0][measurePoint].y
          let basePointX = coordinate[t].landmarks[0][basePoint].x
          let basePointY = coordinate[t].landmarks[0][basePoint].y

          let vectorX = measurePointX - basePointX
          let vectorY = measurePointY - basePointY

          let magnitude = sqrt(vectorX * vectorX + vectorY * vectorY)

          if let basePointIndex = basePoints.firstIndex(of: basePoint), let measurePointIndex = measurePoints.firstIndex(of: measurePoint) {
              vector[t][basePointIndex][measurePointIndex][0] = vectorX / magnitude
              vector[t][basePointIndex][measurePointIndex][1] = vectorY / magnitude
          }
      }
  }

  private func calculateCosin(userVector: [[[[Float]]]], originalVector: [[[[Float]]]], basePoint: Int, measurePoint: Int, cosin: inout [[[Float]]]) {
      if let basePointIndex = basePoints.firstIndex(of: basePoint), let measurePointIndex = measurePoints.firstIndex(of: measurePoint) {
          for t in 0..<userVector.count {
              let userVectorX = userVector[t][basePointIndex][measurePointIndex][0]
              let userVectorY = userVector[t][basePointIndex][measurePointIndex][1]
              let originalVectorX = originalVector[t][basePointIndex][measurePointIndex][0]
              let originalVectorY = originalVector[t][basePointIndex][measurePointIndex][1]

              var dotProduct = userVectorX * originalVectorX + userVectorY * originalVectorY
              dotProduct += 1

              cosin[t][basePointIndex][measurePointIndex] = dotProduct.isNaN ? 1 : dotProduct
          }
      }
  }

  private func totalizeByEachTime(cosin: [[[Float]]]) -> [Float] {
      var eachTimeResult = [Float](repeating: 0.0, count: cosin.count)

      for t in 0..<cosin.count {
          var total: Float = 0

          for b in 0..<cosin[0].count {
              for m in 0..<cosin[0][0].count {
                  total += cosin[t][b][m]
              }
          }

          let percentage = (total * 100) / Float(cosin[0].count * cosin[0][0].count)
          eachTimeResult[t] = percentage
      }

      return eachTimeResult
  }
  
  public func scoring() -> [Float] {
      // ベクトル
      var userVector = Array(repeating: Array(repeating: Array(repeating: [Float](repeating: 0.0, count: 2), count: measurePoints.count), count: basePoints.count), count: userResult.count)
      var originalVector = Array(repeating: Array(repeating: Array(repeating: [Float](repeating: 0.0, count: 2), count: measurePoints.count), count: basePoints.count), count: originalResult.count)

      // コサイン
      var cosinArray = Array(repeating: Array(repeating: [Float](repeating: 0.0, count: measurePoints.count), count: basePoints.count), count: userVector.count)

      for n in 0..<measurePoints.count {
          // 左肩を基準に耳と左半身を計算
          if n < 11 {
              calculateVector(coordinate: userResult, basePoint: basePoints[0], measurePoint: measurePoints[n], vector: &userVector)
              calculateVector(coordinate: originalResult, basePoint: basePoints[0], measurePoint: measurePoints[n], vector: &originalVector)
              calculateCosin(userVector: userVector, originalVector: originalVector, basePoint: basePoints[0], measurePoint: measurePoints[n], cosin: &cosinArray)
          }
          // 右肩を基準に耳と右半身を計算
          if n > 8 {
              calculateVector(coordinate: userResult, basePoint: basePoints[1], measurePoint: measurePoints[n], vector: &userVector)
              calculateVector(coordinate: originalResult, basePoint: basePoints[1], measurePoint: measurePoints[n], vector: &originalVector)
              calculateCosin(userVector: userVector, originalVector: originalVector, basePoint: basePoints[1], measurePoint: measurePoints[n], cosin: &cosinArray)
          }
          // 左腰を基準に左半身を計算
          if n < 9 {
              calculateVector(coordinate: userResult, basePoint: basePoints[2], measurePoint: measurePoints[n], vector: &userVector)
              calculateVector(coordinate: originalResult, basePoint: basePoints[2], measurePoint: measurePoints[n], vector: &originalVector)
              calculateCosin(userVector: userVector, originalVector: originalVector, basePoint: basePoints[2], measurePoint: measurePoints[n], cosin: &cosinArray)
          }
          // 右腰を基準に右半身を計算
          if n > 10 {
              calculateVector(coordinate: userResult, basePoint: basePoints[3], measurePoint: measurePoints[n], vector: &userVector)
              calculateVector(coordinate: originalResult, basePoint: basePoints[3], measurePoint: measurePoints[n], vector: &originalVector)
              calculateCosin(userVector: userVector, originalVector: originalVector, basePoint: basePoints[3], measurePoint: measurePoints[n], cosin: &cosinArray)
          }
      }

      return totalizeByEachTime(cosin: cosinArray)
  }
}
