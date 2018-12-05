package com.clouiss.plottr

import android.content.Intent
import android.support.v7.app.AppCompatActivity
import android.os.Bundle
import android.view.View
import android.app.Activity
import android.net.Uri
import android.os.ParcelFileDescriptor
import android.provider.DocumentsContract
import android.provider.Settings
import android.support.v7.app.AlertDialog
import android.text.InputType
import android.util.Log
import android.widget.EditText
import java.io.BufferedReader
import java.io.File
import java.io.IOException
import java.io.InputStreamReader
import android.provider.OpenableColumns


class MainActivity : AppCompatActivity() {

    private val CREATE_REQUEST_CODE = 40
    private val OPEN_REQUEST_CODE = 41

    private val OVERLAY_PERMISSION_REQ_CODE = 1
    private var storyName = ""

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

//        if (!Settings.canDrawOverlays(this)) {
//            val intent = Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
//                    Uri.parse("package:$packageName"))
//            startActivityForResult(intent, OVERLAY_PERMISSION_REQ_CODE)
//        }
    }

    fun chooseDocument(view: View) {

        val openIntent = Intent(Intent.ACTION_OPEN_DOCUMENT)
        openIntent.addCategory(Intent.CATEGORY_OPENABLE)
        openIntent.setType("text/com.clouiss.plottr.pltr")
        startActivityForResult(openIntent, OPEN_REQUEST_CODE)
    }

    fun createDocument(view: View) {
        val createIntent = Intent(Intent.ACTION_CREATE_DOCUMENT)
        createIntent.setType("text/com.clouiss.plottr.pltr")
        createIntent.addCategory(Intent.CATEGORY_OPENABLE)
        createIntent.putExtra(Intent.EXTRA_TITLE, "story.pltr")
        startActivityForResult(createIntent, CREATE_REQUEST_CODE)
    }

    public override fun onActivityResult(requestCode: Int, resultCode: Int,
                                         resultData: Intent?) {

        if (resultCode == Activity.RESULT_OK) {
            if (requestCode == OPEN_REQUEST_CODE) {
                var uri: Uri? = null
                resultData?.let {
                    val uri = it.data
                    val name = readNameFromUri(uri)
                    var data = readTextFromUri(uri)
                    if (data == "" || data == null) {
                        data = "{\"newFile\":true}"
                    }
                    startReactNative(uri, data, name)
                }
            }

            if (requestCode == CREATE_REQUEST_CODE) {
                var uri: Uri? = null
                resultData?.let {
                    val uri = it.data
                    val name = readNameFromUri(uri)
                    val data = "{\"newFile\":true}"
                    startReactNative(uri, data, name)
                }
            }
//
//            if (requestCode == OVERLAY_PERMISSION_REQ_CODE) {
//                if (!Settings.canDrawOverlays(this)) {
//                    // SYSTEM_ALERT_WINDOW permission not granted
//                }
//            }
        }
    }

    private fun readTextFromUri(uri: Uri): String {
        try {
            val inputStream = contentResolver.openInputStream(uri)
            val reader = BufferedReader(InputStreamReader(
                    inputStream))
            val stringBuilder = StringBuilder()

            var currentline = reader.readLine()

            while (currentline != null) {
                stringBuilder.append(currentline + "\n")
                currentline = reader.readLine()
            }
            inputStream.close()
            return stringBuilder.toString()
        } catch (e: IOException) {
            // Handle error here
            println("--Error reading file--")
        }
        return ""
    }

    private fun readNameFromUri(uri: Uri): String {
        var fileName = ""
        val returnCursor = contentResolver.query(uri, null, null, null, null)
        if (returnCursor != null && returnCursor!!.moveToFirst()) {
            val nameIndex = returnCursor!!.getColumnIndex(OpenableColumns.DISPLAY_NAME)
//            val sizeIndex = returnCursor!!.getColumnIndex(OpenableColumns.SIZE)
            returnCursor!!
            fileName = returnCursor!!.getString(nameIndex)
            returnCursor!!.close()
        }

        return fileName
    }

    private fun startReactNative(uri: Uri, data: String, name: String) {
        val intent = ReactActivity.newIntent(this, uri, data, name)
        startActivity(intent)
    }

//    private fun getFileName() {
//        val alert = AlertDialog.Builder(this)
//        var editTextName: EditText? = null
//        // Builder
//        with (alert) {
//            setTitle("Story name")
//            var name = editTextName?.text.toString()
//            setMessage("Enter a story name")
//            // Add any  input field here
//            editTextName = EditText(context)
//            editTextName!!.hint=""
//            editTextName!!.inputType = InputType.TYPE_CLASS_TEXT
//            setPositiveButton("OK") {
//                dialog, whichButton ->
//                    dialog.dismiss()
//                    var fileName = editTextName!!.text.toString()
//                    storyName = fileName
//                    fileName = fileName + ".pltr"
//                    val createIntent = Intent(Intent.ACTION_CREATE_DOCUMENT)
//                    createIntent.setType("text/plain")
//                    createIntent.putExtra("fileName", fileName)
//                    startActivityForResult(createIntent, CREATE_REQUEST_CODE)
//            }
//            setNegativeButton("Cancel") {
//                dialog, whichButton ->
//                    dialog.dismiss()
//            }
//        }
//        // Dialog
//        val dialog = alert.create()
//        dialog.setView(editTextName)
//        dialog.show()
//    }

}
