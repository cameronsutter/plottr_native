//
//  ThumbnailProvider.swift
//  Plottr-Thumbnail-Ext
//
//  Created by Cameron Sutter on 3/26/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

import UIKit
import QuickLook

class ThumbnailProvider: QLThumbnailProvider {
    
    override func provideThumbnail(for request: QLFileThumbnailRequest, _ handler: @escaping (QLThumbnailReply?, Error?) -> Void) {
        
        // There are three ways to provide a thumbnail through a QLThumbnailReply. Only one of them should be used.
        
        // First way: Draw the thumbnail into the current context, set up with UIKit's coordinate system.
        /*
        handler(QLThumbnailReply(contextSize: request.maximumSize, currentContextDrawing: { () -> Bool in
            // Draw the thumbnail here.
          print("thumbnail provider!")

            // Return true if the thumbnail was successfully drawn inside this block.
            return true
        }), nil)


        
        // Second way: Draw the thumbnail into a context passed to your block, set up with Core Graphics' coordinate system.
        handler(QLThumbnailReply(contextSize: request.maximumSize, drawing: { (context) -> Bool in
            // Draw the thumbnail here.
         
            // Return true if the thumbnail was successfully drawn inside this block.
            return true
        }), nil)

        
        */
      // Third way: Set an image file URL.
      let url = Bundle.main.url(forResource: "PlottrDocumentIcon58", withExtension: "png")!
      print(url.absoluteString)
      handler(QLThumbnailReply(imageFileURL: url), nil)
    }
}
