import React from "react";
import { SettingsProvider } from "../components/context/SettingsContext";
import ReadingPage from "./ReadingPage";

export default function Reader() {
    return (
        <SettingsProvider>
            <ReadingPage />
        </SettingsProvider>
    );
    }