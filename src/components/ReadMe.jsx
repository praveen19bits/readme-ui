import React, { useState } from "react";
import {
  TextField,
  Button,
  Card,
  CardContent,
  IconButton,
  Snackbar,
  Tabs,
  Tab,
  Typography,
  Tooltip
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import axios from "axios";

export default function ReadmeGenerator() {
  const [tabIndex, setTabIndex] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [includePatterns, setIncludePatterns] = useState("");
  const [excludePatterns, setExcludePatterns] = useState("");
  const [readmeContent, setReadmeContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const defaultIncludePatterns = "Include the files which you want to make part of readMe file. Example:  src/main/java/com/ai/readme_generator/controllers/**,*.xml, **/*.xml, **/*.yaml, **/*.yml (Comma-separated)";
  const defaultExcludePatterns = "Exclude the files which you do not want to make part of readMe file. If nothing specified, default will be considered. Example: node_modules/, target/, *.log (Comma-separated)";

  const handleGenerateReadme = async () => {
    if (!inputValue) return;
    setIsGenerating(true);
    try {
      const endpoint = tabIndex === 0 ? "http://localhost:8080/local" : "http://localhost:8080/readme/github";
      const payload = {
        pathOrRepoUrl: inputValue,
        readConfig: {
          includePatterns: includePatterns.split(",").map(p => p.trim()),
          excludePatterns: excludePatterns.split(",").map(p => p.trim()),
        }
      };
      const response = await axios.post(endpoint, payload, {
        headers: { "Content-Type": "application/json" },
      });
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
      <Typography variant="h4" gutterBottom>
        Readme Generator
      </Typography>
      <Card>
        <CardContent>
          <Tabs value={tabIndex} onChange={(e, newIndex) => setTabIndex(newIndex)} centered>
            <Tab label="Local Path" />
            <Tab label="GitHub Repo" />
          </Tabs>
          <TextField
            fullWidth
            label={tabIndex === 0 ? "Enter system directory path" : "Enter GitHub repo link"}
            variant="outlined"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            margin="normal"
          />
          <div style={{ display: "flex", alignItems: "center" }}>
            <TextField
              fullWidth
              label="Include Patterns (Comma-separated)"
              variant="outlined"
              margin="normal"
              value={includePatterns}
              onChange={(e) => setIncludePatterns(e.target.value)}
            />
            <Tooltip title={defaultIncludePatterns} arrow>
              <IconButton>
                <InfoIcon />
              </IconButton>
            </Tooltip>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <TextField
              fullWidth
              label="Exclude Patterns (Comma-separated)"
              variant="outlined"
              margin="normal"
              value={excludePatterns}
              onChange={(e) => setExcludePatterns(e.target.value)}
            />
            <Tooltip title={defaultExcludePatterns} arrow>
              <IconButton>
                <InfoIcon />
              </IconButton>
            </Tooltip>
          </div>
          <Button
            variant="contained"
            color="primary"
            onClick={handleGenerateReadme}
            disabled={!inputValue || isGenerating}
            fullWidth
          >
            {isGenerating ? "Generating..." : "Generate README"}
          </Button>
        </CardContent>
      </Card>

      {readmeContent && (
        <Card style={{ marginTop: "20px", position: "relative" }}>
          <CardContent>
            <TextField fullWidth multiline rows={10} value={readmeContent} InputProps={{ readOnly: true }} />
            <IconButton
              style={{ position: "absolute", top: 10, right: 10 }}
              onClick={handleCopy}
            >
              <ContentCopyIcon />
            </IconButton>
          </CardContent>
        </Card>
      )}
      <Snackbar
        open={copySuccess}
        autoHideDuration={2000}
        onClose={() => setCopySuccess(false)}
        message="Copied!"
      />
    </div>
  );
}
