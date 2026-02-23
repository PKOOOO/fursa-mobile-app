import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import { useState, useRef } from "react";
import {
    View,
    Text,
    SafeAreaView,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    StyleSheet,
    Platform,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { useUser } from "@clerk/clerk-expo";
import { COLORS, SIZES } from "../../constants";
import API_BASE_URL from "../../constants/api";

const ApplyScreen = () => {
    const { id, title, company } = useLocalSearchParams();
    const { user } = useUser();
    const router = useRouter();

    const [coverLetter, setCoverLetter] = useState("");
    const [cvFile, setCvFile] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    // Simple formatting state
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const inputRef = useRef(null);

    const pickDocument = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: "application/pdf",
                copyToCacheDirectory: true,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                setCvFile(result.assets[0]);
            }
        } catch (err) {
            console.error("Document picker error:", err);
            Alert.alert("Error", "Failed to pick document");
        }
    };

    const insertFormatting = (type) => {
        let insertion = "";
        switch (type) {
            case "bold":
                insertion = "**bold text**";
                setIsBold(!isBold);
                break;
            case "italic":
                insertion = "_italic text_";
                setIsItalic(!isItalic);
                break;
            case "bullet":
                insertion = "\n• ";
                break;
            case "numbered":
                insertion = "\n1. ";
                break;
        }
        setCoverLetter((prev) => prev + insertion);
        inputRef.current?.focus();
    };

    const handleSubmit = async () => {
        if (!coverLetter.trim() && !cvFile) {
            Alert.alert("Required", "Please add a cover letter or upload your CV.");
            return;
        }

        setSubmitting(true);
        try {
            // Convert cover letter markdown to simple HTML
            let htmlCover = coverLetter
                .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
                .replace(/_(.*?)_/g, "<i>$1</i>")
                .replace(/• (.*)/g, "<li>$1</li>")
                .replace(/\n/g, "<br>");

            let res;

            if (cvFile) {
                // Use FormData for file upload — do NOT set Content-Type manually
                const formData = new FormData();
                formData.append("userId", user?.id || "anonymous");
                formData.append("userName", user?.fullName || "Anonymous User");
                formData.append(
                    "userEmail",
                    user?.primaryEmailAddress?.emailAddress || "no-email@example.com"
                );
                formData.append("coverLetter", htmlCover);
                formData.append("cv", {
                    uri: cvFile.uri,
                    name: cvFile.name || "cv.pdf",
                    type: cvFile.mimeType || "application/pdf",
                });

                res = await fetch(`${API_BASE_URL}/api/jobs/${id}/apply`, {
                    method: "POST",
                    body: formData,
                });
            } else {
                // Use JSON when no file attached
                res = await fetch(`${API_BASE_URL}/api/jobs/${id}/apply`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        userId: user?.id || "anonymous",
                        userName: user?.fullName || "Anonymous User",
                        userEmail: user?.primaryEmailAddress?.emailAddress || "no-email@example.com",
                        coverLetter: htmlCover,
                    }),
                });
            }

            const data = await res.json();

            if (res.ok) {
                Alert.alert(
                    "Application Sent! 🎉",
                    `Your application for ${title || "this job"} has been submitted successfully.`,
                    [{ text: "OK", onPress: () => router.back() }]
                );
            } else if (res.status === 409) {
                Alert.alert("Already Applied", "You have already applied for this job.");
            } else {
                Alert.alert("Error", data.error || "Failed to submit application.");
            }
        } catch (err) {
            console.error("Submit error:", err);
            Alert.alert("Error", "Something went wrong. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <SafeAreaView style={styles.safe}>
            <Stack.Screen
                options={{
                    headerTitle: "Apply",
                    headerBackTitle: "Back",
                    headerShadowVisible: false,
                    headerStyle: { backgroundColor: COLORS.lightWhite },
                }}
            />

            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                {/* Job info header */}
                <View style={styles.jobInfoCard}>
                    <Text style={styles.jobTitle}>{title || "Job"}</Text>
                    <Text style={styles.jobCompany}>{company || ""}</Text>
                </View>

                {/* CV Upload */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Upload CV</Text>
                    <Text style={styles.sectionHint}>PDF format, max 10MB</Text>

                    <TouchableOpacity style={styles.uploadArea} onPress={pickDocument}>
                        {cvFile ? (
                            <View style={styles.fileSelected}>
                                <Text style={styles.fileIcon}>📄</Text>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.fileName} numberOfLines={1}>
                                        {cvFile.name}
                                    </Text>
                                    <Text style={styles.fileSize}>
                                        {(cvFile.size / 1024).toFixed(0)} KB
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    onPress={() => setCvFile(null)}
                                    style={styles.removeBtn}
                                >
                                    <Text style={styles.removeBtnText}>✕</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <View style={styles.uploadPlaceholder}>
                                <Text style={styles.uploadIcon}>📎</Text>
                                <Text style={styles.uploadText}>Tap to select your CV</Text>
                                <Text style={styles.uploadSubtext}>PDF files only</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Cover Letter */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Cover Letter</Text>
                    <Text style={styles.sectionHint}>
                        Tell the employer why you're a great fit
                    </Text>

                    {/* Formatting toolbar */}
                    <View style={styles.toolbar}>
                        <TouchableOpacity
                            style={[styles.toolBtn, isBold && styles.toolBtnActive]}
                            onPress={() => insertFormatting("bold")}
                        >
                            <Text style={[styles.toolBtnText, { fontWeight: "800" }]}>B</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.toolBtn, isItalic && styles.toolBtnActive]}
                            onPress={() => insertFormatting("italic")}
                        >
                            <Text style={[styles.toolBtnText, { fontStyle: "italic" }]}>I</Text>
                        </TouchableOpacity>
                        <View style={styles.toolDivider} />
                        <TouchableOpacity
                            style={styles.toolBtn}
                            onPress={() => insertFormatting("bullet")}
                        >
                            <Text style={styles.toolBtnText}>•</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.toolBtn}
                            onPress={() => insertFormatting("numbered")}
                        >
                            <Text style={styles.toolBtnText}>1.</Text>
                        </TouchableOpacity>
                    </View>

                    <TextInput
                        ref={inputRef}
                        style={styles.textArea}
                        multiline
                        numberOfLines={10}
                        placeholder="Dear Hiring Manager,&#10;&#10;I'm writing to express my interest in this position..."
                        placeholderTextColor="#999"
                        value={coverLetter}
                        onChangeText={setCoverLetter}
                        textAlignVertical="top"
                    />
                    <Text style={styles.charCount}>{coverLetter.length} characters</Text>
                </View>
            </ScrollView>

            {/* Submit button */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.submitBtn, submitting && styles.submitBtnDisabled]}
                    onPress={handleSubmit}
                    disabled={submitting}
                >
                    {submitting ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.submitBtnText}>Submit Application</Text>
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: COLORS.lightWhite,
    },
    scroll: {
        flex: 1,
    },
    scrollContent: {
        padding: SIZES.medium,
        paddingBottom: 100,
    },
    jobInfoCard: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "#f0f0f0",
    },
    jobTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: COLORS.primary,
        marginBottom: 4,
    },
    jobCompany: {
        fontSize: 14,
        color: "#666",
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: COLORS.primary,
        marginBottom: 4,
    },
    sectionHint: {
        fontSize: 13,
        color: "#888",
        marginBottom: 12,
    },
    uploadArea: {
        borderRadius: 12,
        borderWidth: 2,
        borderStyle: "dashed",
        borderColor: "#ddd",
        backgroundColor: "#fff",
        overflow: "hidden",
    },
    uploadPlaceholder: {
        alignItems: "center",
        padding: 32,
    },
    uploadIcon: {
        fontSize: 32,
        marginBottom: 8,
    },
    uploadText: {
        fontSize: 15,
        fontWeight: "600",
        color: COLORS.primary,
    },
    uploadSubtext: {
        fontSize: 12,
        color: "#999",
        marginTop: 4,
    },
    fileSelected: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        gap: 12,
    },
    fileIcon: {
        fontSize: 28,
    },
    fileName: {
        fontSize: 14,
        fontWeight: "600",
        color: COLORS.primary,
    },
    fileSize: {
        fontSize: 12,
        color: "#888",
        marginTop: 2,
    },
    removeBtn: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: "#f0f0f0",
        alignItems: "center",
        justifyContent: "center",
    },
    removeBtnText: {
        fontSize: 12,
        color: "#666",
    },
    toolbar: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#e0e0e0",
        borderBottomWidth: 0,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        padding: 6,
        gap: 4,
    },
    toolBtn: {
        width: 36,
        height: 32,
        borderRadius: 6,
        alignItems: "center",
        justifyContent: "center",
    },
    toolBtnActive: {
        backgroundColor: "#e8e8e8",
    },
    toolBtnText: {
        fontSize: 16,
        color: COLORS.primary,
    },
    toolDivider: {
        width: 1,
        height: 20,
        backgroundColor: "#e0e0e0",
        marginHorizontal: 4,
    },
    textArea: {
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#e0e0e0",
        borderTopWidth: 0,
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
        padding: 16,
        fontSize: 15,
        lineHeight: 22,
        color: "#333",
        minHeight: 200,
    },
    charCount: {
        fontSize: 12,
        color: "#999",
        textAlign: "right",
        marginTop: 6,
    },
    footer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        paddingBottom: Platform.OS === "ios" ? 34 : 16,
        backgroundColor: COLORS.lightWhite,
        borderTopWidth: 1,
        borderTopColor: "#f0f0f0",
    },
    submitBtn: {
        backgroundColor: COLORS.primary,
        borderRadius: 12,
        padding: 16,
        alignItems: "center",
    },
    submitBtnDisabled: {
        opacity: 0.6,
    },
    submitBtnText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
    },
});

export default ApplyScreen;
