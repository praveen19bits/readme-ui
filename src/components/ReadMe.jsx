import React, { useState } from "react";
import { TextField, Button, Card, CardContent, IconButton, Snackbar, Alert } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import axios from "axios";

export default function ReadmeGenerator() {
  const [directory, setDirectory] = useState("");
  const [readmeContent, setReadmeContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleGenerateReadme = async () => {
    if (!directory) return;
    setIsGenerating(true);
    try {
      const encodedPath = encodeURIComponent(directory);
      const response = await axios.post(`http://localhost:8080/readme?localPath=${encodedPath}`);
      setReadmeContent(response.data);
    } catch (error) {
      console.error("Error generating README:", error.message || error.toString());
      setReadmeContent("Error generating README. Please try again.");
    }
    setIsGenerating(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(readmeContent);
    setCopySuccess(true);
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "20px", textAlign: "center" }}>
      <h2 style={{ marginBottom: "20px", color: "#1976d2" }}>README Generator</h2>
      <Card style={{ padding: "20px", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)" }}>
        <CardContent>
          <TextField
            fullWidth
            label="Enter system directory path"
            variant="outlined"
            value={directory}
            onChange={(e) => setDirectory(e.target.value)}
            margin="normal"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleGenerateReadme}
            disabled={!directory || isGenerating}
            fullWidth
            style={{ marginTop: "10px" }}
          >
            {isGenerating ? "Generating..." : "Generate README"}
          </Button>
        </CardContent>
      </Card>

      {readmeContent && (
        <Card style={{ marginTop: "20px", padding: "10px", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)" }}>
          <CardContent style={{ position: "relative" }}>
            <TextField
              fullWidth
              multiline
              rows={10}
              value={readmeContent}
              InputProps={{ readOnly: true }}
              style={{ backgroundColor: "#f5f5f5" }}
            />
            <IconButton
              style={{ position: "absolute", top: 10, right: 10, color: "#1976d2" }}
              onClick={handleCopy}
            >
              <ContentCopyIcon />
            </IconButton>
          </CardContent>
        </Card>
      )}

      <Snackbar open={copySuccess} autoHideDuration={2000} onClose={() => setCopySuccess(false)}>
        <Alert onClose={() => setCopySuccess(false)} severity="success" sx={{ width: '100%' }}>
          Copied!
        </Alert>
      </Snackbar>
    </div>
  );
}
