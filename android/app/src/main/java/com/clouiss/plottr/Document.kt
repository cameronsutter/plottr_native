package com.clouiss.plottr

import android.app.PendingIntent.getActivity
import android.content.ContentResolver
import android.content.Context
import android.net.Uri
import android.os.ParcelFileDescriptor
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import java.io.File
import java.io.FileNotFoundException
import java.io.FileOutputStream
import java.io.IOException

class Document : ReactContextBaseJavaModule {

    var docUri: String = ""
    var docData: String = ""
    val context: Context

    constructor(reactContext: ReactApplicationContext) : super(reactContext) {
        context = reactContext
    }

    override fun getName(): String {
        return "Document"
    }

    @ReactMethod
    fun setDocumentData(uri: String, data: String) {
        docUri = uri
        docData = data
    }

    @ReactMethod
    fun saveDocument(newData: String) {
        docData = newData

        try {
            val uri : Uri = Uri.parse(docUri)
            var pfd: ParcelFileDescriptor = context.contentResolver.openFileDescriptor(uri, "w")
            val fileOutputStream : FileOutputStream = FileOutputStream(pfd.getFileDescriptor())
            fileOutputStream.write(newData.toByteArray())
            // Let the document provider know you're done by closing the stream.
            fileOutputStream.close()
            pfd.close()
        } catch (e : FileNotFoundException) {
            e.printStackTrace();
        } catch (e : IOException) {
            e.printStackTrace();
        }
    }
}