//
//  MarkEachFrame.swift
//  ChumChumEvaluation
//
//  Created by Satoko Fujiyoshi on 2024/10/22.
//

import Foundation
import MediaPipeTasksVision
import UIKit

//線描画オブジェクト
struct Line{
  let from: CGPoint
  let to: CGPoint
}

//色、大きさ設定
struct DefaultConstants {
    static let pointRadius: CGFloat = 5.0
    static let pointFillColor: UIColor = UIColor.yellow
    static let pointColor: UIColor = UIColor.yellow
    static let lineWidth: CGFloat = 2.0
    static let lineColor: UIColor = UIColor.blue
}

//描画設定オブジェクト
struct Marker{
  let dots: [CGPoint]
  let lines: [Line]
}

class MarkEachFrame: UIView{
  var markers: [Marker] = []
  
  private var contentImageSize: CGSize = CGSizeZero
  var imageContentMode: UIView.ContentMode = .scaleAspectFit
  private var orientation = UIDeviceOrientation.portrait
  
  private var edgeOffset: CGFloat = 0.0
  
  //初期設定
  private func clear(){
    markers = []
    contentImageSize = CGSizeZero
    imageContentMode = .scaleAspectFit
    orientation = UIDevice.current.orientation
    edgeOffset = 0.0
  }
  
  //描画設定
  private static func setMarkers(
    resultLandmark: [[NormalizedLandmark]],
    imageSize: CGSize,
    imageContentMode: UIView.ContentMode,
    orientation: UIImage.Orientation) -> [Marker]{
      var markers: [Marker] = []
      
      guard !resultLandmark.isEmpty else {
        return []
      }
      
      for landmark in resultLandmark {
        var transformedResult: [CGPoint]!
        
        switch orientation{
          case .left:
            transformedResult = landmark.map({CGPoint(x: CGFloat($0.y), y: 1 - CGFloat($0.x))})
          case .right:
            transformedResult = landmark.map({CGPoint(x: 1 - CGFloat($0.y), y: CGFloat($0.x))})
          default:
            transformedResult = landmark.map({CGPoint(x: CGFloat($0.x), y: CGFloat($0.y))})
        }
        
        let dots: [CGPoint] = transformedResult.map {CGPoint(x: CGFloat($0.x) * imageSize.width, y: CGFloat($0.y) * imageSize.height)}
        let lines: [Line] = PoseLandmarker.poseLandmarks.map({connection in
          let start = dots[Int(connection.start)]
          let end = dots[Int(connection.end)]
          return Line(from: start, to: end)})
        
        markers.append(Marker(dots: dots, lines: lines))
      }
      
      return markers
    }
  
  private func drawLines(_ lines: [Line]){
    let path = UIBezierPath()
    for line in lines{
      path.move(to: line.from)
      path.addLine(to: line.to)
    }
    path.lineWidth = DefaultConstants.lineWidth
    DefaultConstants.lineColor.setStroke()
    path.stroke()
  }
  
  private func drawDots(_ dots: [CGPoint]){
    for dot in dots{
      let dotRect = CGRect(
        x: CGFloat(dot.x) - DefaultConstants.pointRadius/2,
        y: CGFloat(dot.y) - DefaultConstants.pointRadius / 2,
        width: DefaultConstants.pointRadius,
        height: DefaultConstants.pointRadius)
      let path = UIBezierPath(ovalIn: dotRect)
      DefaultConstants.pointFillColor.setFill()
      DefaultConstants.pointColor.setStroke()
      path.stroke()
      path.fill()
    }
  }
  
  //描画
  public func draw(image: CGImage, resultLandmark: [[NormalizedLandmark]]) -> UIImage?{
    clear()
    
    let imageSize = CGSize(width: image.width, height: image.height)
    
    MarkEachFrame.setMarkers(
      resultLandmark: resultLandmark,
      imageSize: imageSize,
      imageContentMode: .scaleAspectFit,
      orientation: .up
    )
    
    let renderer = UIGraphicsImageRenderer(size: imageSize)
    
    let drawImage = renderer.image { context in
      UIImage(cgImage: image).draw(at: .zero)
      
      for marker in markers {
        drawLines(marker.lines)
        drawDots(marker.dots)
      }
    }
    
    return drawImage
  }
}
