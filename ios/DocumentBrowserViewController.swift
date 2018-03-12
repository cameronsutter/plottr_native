//
//  DocumentBrowserViewController.swift
//  plottr_native
//
//  Created by Cameron Sutter on 2/9/18.
//  Copyright © 2018 C Louis S. All rights reserved.
//

import UIKit

class DocumentBrowserViewController: UIDocumentBrowserViewController, UIDocumentBrowserViewControllerDelegate {

  override func viewDidLoad() {
    super.viewDidLoad()

    delegate = self

    // this will be for v0.3
//    allowsDocumentCreation = true
    allowsPickingMultipleItems = false

    // Update the style of the UIDocumentBrowserViewController
    //         browserUserInterfaceStyle = .dark
     view.tintColor = .orange

    // Specify the allowed content types of your application via the Info.plist.

    // Do any additional setup after loading the view, typically from a nib.
  }


  // MARK: UIDocumentBrowserViewControllerDelegate

  func documentBrowser(_ controller: UIDocumentBrowserViewController, didRequestDocumentCreationWithHandler importHandler: @escaping (URL?, UIDocumentBrowserViewController.ImportMode) -> Void) {
    let newDocumentURL: URL? = nil
    print("Got to here: line 36")
    print(newDocumentURL?.absoluteString ?? "there is no url for this new document")
    // Set the URL for the new document here. Optionally, you can present a template chooser before calling the importHandler.
    // Make sure the importHandler is always called, even if the user cancels the creation request.
    let alert = UIAlertController(title: "What is the story's name?", message: nil, preferredStyle: .alert)
    alert.addAction(UIAlertAction(title: "Cancel", style: .cancel, handler: nil))

    alert.addTextField(configurationHandler: { textField in
      textField.placeholder = "Story name..."
    })

    alert.addAction(UIAlertAction(title: "OK", style: .default, handler: { action in

      if let name = alert.textFields?.first?.text {

        let fileManager = FileManager.default
        var documentDirectory = URL(fileURLWithPath: "")
        do {
          documentDirectory = try fileManager.url(for: .documentDirectory, in: .userDomainMask, appropriateFor:nil, create:false)
        } catch {
          print("error")
        }

        var escapedFileName = name.replacingOccurrences(of: " ", with: "_")
        escapedFileName = "\(escapedFileName).pltr"

        let fileURL = documentDirectory.appendingPathComponent(escapedFileName)

//        guard let documentPath = NSSearchPathForDirectoriesInDomains(.documentDirectory, .userDomainMask, true).first else { return }
//
//        let filePath = "\(documentPath)/\(name).pltr"
//
//        let fileURL = URL(fileURLWithPath: filePath)

        let doc = PlottrDocument(fileURL: fileURL)
        let basicJSON = "{\"storyName\":\"\(name)\", \"newFile\":true}"
        doc.updateStringContents(data: basicJSON)
        doc.save(to: fileURL, for: .forCreating, completionHandler: { (saved) in
          print("saving new file \(saved)")
          self.presentDocument(at: fileURL)
          if newDocumentURL != nil {
            importHandler(fileURL, .move)
          } else {
            importHandler(nil, .none)
          }
        })
//        doc.open(completionHandler: { (success) in
//          print("opened new file: \(success)")
//          if (success) {
//            let basicJSON = "{\"storyName\":\"\(name)\", \"newFile\":true}"
//            doc.updateStringContents(data: basicJSON)
//            doc.save(to: fileURL, for: .forCreating, completionHandler: { (saved) in
//              print("saving new file")
//              doc.close(completionHandler: { (closed) in
//                print("closing new file")
//                self.presentDocument(at: fileURL)
//              })
//              if newDocumentURL != nil {
//                importHandler(fileURL, .move)
//              } else {
//                importHandler(nil, .none)
//              }
//            })
//          }
//        })
      }
    }))

    self.present(alert, animated: true)
  }

  func documentBrowser(_ controller: UIDocumentBrowserViewController, didPickDocumentURLs documentURLs: [URL]) {
    guard let sourceURL = documentURLs.first else { return }
    print("Got to here: line 48")
    print(sourceURL.absoluteString)
    // Present the Document View Controller for the first document that was picked.
    // If you support picking multiple items, make sure you handle them all.
    presentDocument(at: sourceURL)
  }

  func documentBrowser(_ controller: UIDocumentBrowserViewController, didImportDocumentAt sourceURL: URL, toDestinationURL destinationURL: URL) {
    print("Got to here: line 55")
    // Present the Document View Controller for the new newly created document
    presentDocument(at: destinationURL)
  }

  func documentBrowser(_ controller: UIDocumentBrowserViewController, failedToImportDocumentAt documentURL: URL, error: Error?) {
    print("Got to here: line 61")
    // Make sure to handle the failed import appropriately, e.g., by presenting an error message to the user.
  }

  // MARK: Document Presentation

  func presentDocument(at documentURL: URL) {
    let doc = PlottrDocument(fileURL: documentURL)

    if (DocumentViewController.sharedInstance() != nil) {
      DocumentViewController.setSharedInstance(instance: nil)
    }

    let storyBoard = UIStoryboard(name: "Main", bundle: nil)
    let documentViewController = storyBoard.instantiateViewController(withIdentifier: "DocumentViewController") as! DocumentViewController
    documentViewController.document = doc
    present(documentViewController, animated: true, completion: nil)
  }
}


