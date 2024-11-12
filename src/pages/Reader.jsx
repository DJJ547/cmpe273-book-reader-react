import React from "react";
import { SettingsProvider } from "../components/context/SettingsContext";
import ReadingPage from "./ReadingPage";
import "../index.css";

export default function Reader() {
    return (
        <SettingsProvider>
            <ReadingPage />
        </SettingsProvider>
    );
    }