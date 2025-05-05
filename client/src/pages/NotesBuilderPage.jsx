"use client"

import { useState } from "react"
import { FaRobot, FaSave, FaFileExport, FaShareAlt, FaEye } from "react-icons/fa"
import api from "../services/api"
import "./NotesBuilderPage.css"

const NotesBuilderPage = () => {
  const [topic, setTopic] = useState("")
  const [level, setLevel] = useState("beginner")
  const [contentType, setContentType] = useState("notes")
  const [generatedContent, setGeneratedContent] = useState("")
  const [editorContent, setEditorContent] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)
  const [documentTitle, setDocumentTitle] = useState("Untitled Document")

  const generateContent = async () => {
    if (!topic) return

    setIsGenerating(true)

    try {
      const response = await api.post("/ai/generate", {
        topic,
        level,
        contentType,
      })

      setGeneratedContent(response.data.content)
      setEditorContent(response.data.content)
    } catch (error) {
      console.error("Error generating content:", error)
      alert("Failed to generate content. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleEditorChange = (content) => {
    setEditorContent(content)
  }

  const saveDocument = async () => {
    try {
      await api.post("/documents", {
        title: documentTitle,
        content: editorContent,
        type: contentType,
        level,
      })

      alert("Document saved successfully!")
    } catch (error) {
      console.error("Error saving document:", error)
      alert("Failed to save document. Please try again.")
    }
  }

  const exportDocument = () => {
    const element = document.createElement("a")
    const file = new Blob([editorContent], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = `${documentTitle}.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const shareDocument = async () => {
    try {
      const response = await api.post("/documents/share", {
        title: documentTitle,
        content: editorContent,
        type: contentType,
        level,
      })

      alert(`Document shared! Share link: ${response.data.shareLink}`)
    } catch (error) {
      console.error("Error sharing document:", error)
      alert("Failed to share document. Please try again.")
    }
  }

  // Mock editor blocks for demonstration
  const editorBlocks = [
    { id: "header", label: "Header", icon: "H" },
    { id: "paragraph", label: "Paragraph", icon: "P" },
    { id: "image", label: "Image", icon: "I" },
    { id: "table", label: "Table", icon: "T" },
    { id: "formula", label: "Formula", icon: "F" },
    { id: "list", label: "List", icon: "L" },
  ]

  return (
    <div className="notes-builder-page">
      <div className="builder-header">
        <input
          type="text"
          className="document-title"
          value={documentTitle}
          onChange={(e) => setDocumentTitle(e.target.value)}
          placeholder="Document Title"
        />

        <div className="builder-actions">
          <button className="action-button preview" onClick={() => setPreviewMode(!previewMode)}>
            <FaEye /> {previewMode ? "Edit" : "Preview"}
          </button>
          <button className="action-button save" onClick={saveDocument}>
            <FaSave /> Save
          </button>
          <button className="action-button export" onClick={exportDocument}>
            <FaFileExport /> Export
          </button>
          <button className="action-button share" onClick={shareDocument}>
            <FaShareAlt /> Share
          </button>
        </div>
      </div>

      <div className="builder-content">
        {!previewMode ? (
          <>
            <div className="ai-sidebar">
              <div className="ai-generator">
                <h3>
                  <FaRobot /> AI Content Generator
                </h3>
                <div className="generator-form">
                  <div className="form-group">
                    <label>Topic</label>
                    <input
                      type="text"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="e.g., Photosynthesis"
                    />
                  </div>

                  <div className="form-group">
                    <label>Level</label>
                    <select value={level} onChange={(e) => setLevel(e.target.value)}>
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Content Type</label>
                    <select value={contentType} onChange={(e) => setContentType(e.target.value)}>
                      <option value="notes">Study Notes</option>
                      <option value="quiz">Quiz Questions</option>
                      <option value="lesson">Lesson Plan</option>
                    </select>
                  </div>

                  <button className="generate-button" onClick={generateContent} disabled={isGenerating || !topic}>
                    {isGenerating ? "Generating..." : "Generate Content"}
                  </button>
                </div>

                {generatedContent && (
                  <div className="generated-content">
                    <h4>Generated Content</h4>
                    <div className="content-preview">{generatedContent.substring(0, 200)}...</div>
                    <button className="use-content-button" onClick={() => setEditorContent(generatedContent)}>
                      Use This Content
                    </button>
                  </div>
                )}
              </div>

              <div className="editor-blocks">
                <h3>Content Blocks</h3>
                <div className="blocks-grid">
                  {editorBlocks.map((block) => (
                    <div key={block.id} className="block-item" draggable>
                      <div className="block-icon">{block.icon}</div>
                      <div className="block-label">{block.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="editor-canvas">
              <div className="editor-toolbar">
                <button>Bold</button>
                <button>Italic</button>
                <button>Underline</button>
                <select>
                  <option>Normal Text</option>
                  <option>Heading 1</option>
                  <option>Heading 2</option>
                  <option>Heading 3</option>
                </select>
              </div>

              <textarea
                className="editor-textarea"
                value={editorContent}
                onChange={(e) => handleEditorChange(e.target.value)}
                placeholder="Start typing or drag content blocks here..."
              ></textarea>
            </div>
          </>
        ) : (
          <div className="preview-container">
            <div className="preview-content">
              <div dangerouslySetInnerHTML={{ __html: editorContent.replace(/\n/g, "<br>") }}></div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default NotesBuilderPage
