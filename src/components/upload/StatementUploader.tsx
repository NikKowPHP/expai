// src/components/upload/StatementUploader.tsx

// This component uses hooks (useState, useRef) and event handlers, so it must be a client component.
"use client";

import {
  Button,
  Field,
  MessageBar,
  MessageBarBody,
  Spinner,
  Text,
} from "@fluentui/react-components";
import React, { useRef, useState } from "react";

export function StatementUploader() {
  // --- 1.1: State Management ---
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // A ref to programmatically click the hidden file input
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Handler for file selection ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Reset status when a new file is selected
      setStatus("idle");
      setErrorMessage(null);
      setSuccessMessage(null);
    }
  };

  // --- 1.2: Frontend Upload Logic ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Check if a file has been selected
    if (!file) {
      setStatus("error");
      setErrorMessage("Please select a file to upload.");
      return;
    }

    // 2. Set status to 'uploading'
    setStatus("uploading");
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      // 3. Create a FormData object
      const formData = new FormData();
      // 4. Append the selected file
      formData.append("statement", file);

      // 5. Use fetch to send a POST request
      const response = await fetch("/api/transactions/upload", {
        method: "POST",
        // 6. The body is the formData object
        body: formData,
      });

      // 7. Handle the response
      if (response.ok) {
        const result = await response.json();
        setStatus("success");
        setSuccessMessage(`Success! ${result.newTransactionsCount || 0} new transactions were added.`);
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || "An unknown error occurred.");
        setStatus("error");
      }
    } catch (error) {
      // 8. Handle network errors
      console.error("Upload failed:", error);
      setErrorMessage("A network error occurred. Please try again.");
      setStatus("error");
    }
  };

  // --- UI Rendering ---
  return (
    <div className="w-full max-w-lg mx-auto flex flex-col gap-4 p-4 border rounded-lg shadow-sm">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field
          label="Upload Financial Statement"
          validationMessage={file ? `Selected: ${file.name}` : "No file selected."}
        >
          {/* This is a hidden file input that we'll trigger programmatically */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".csv,.pdf" // Specify accepted file types
            className="hidden"
          />
          {/* This is the visible button the user clicks */}
          <Button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={status === "uploading"}
          >
            Choose File
          </Button>
        </Field>

        <Button
          type="submit"
          appearance="primary"
          disabled={!file || status === "uploading"}
        >
          Upload and Process
        </Button>
      </form>

      {/* Conditional UI based on status */}
      <div className="h-16">
        {status === "uploading" && (
          <div className="flex flex-col items-center justify-center gap-2">
            <Spinner size="small" />
            <Text>Processing your statement... This may take a moment.</Text>
          </div>
        )}

        {status === "success" && successMessage && (
          <MessageBar intent="success">
            <MessageBarBody>{successMessage}</MessageBarBody>
          </MessageBar>
        )}

        {status === "error" && errorMessage && (
          <MessageBar intent="error">
            <MessageBarBody>{errorMessage}</MessageBarBody>
          </MessageBar>
        )}
      </div>
    </div>
  );
}
