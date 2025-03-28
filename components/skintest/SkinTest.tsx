import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { api } from "@/lib/api/endpoints";
import type {
  SkinTestQuestion,
  SkinTest as SkinTestType,
  SkinTestAnswerRequest,
} from "@/lib/types/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const { width } = Dimensions.get("window");

// const skinTypes = [
//   {
//     id: 1,
//     type: "Normal",
//     description: "Well-balanced: neither too oily nor too dry",
//     characteristics: ["Smooth texture", "Few imperfections", "Small pores"],
//     image: "https://v0.dev/placeholder.svg?height=100&width=100",
//     color: "#E0F7FA",
//   },
//   {
//     id: 2,
//     type: "Dry",
//     description: "Produces less sebum than normal skin",
//     characteristics: ["Rough texture", "Red patches", "Less elasticity"],
//     image: "https://v0.dev/placeholder.svg?height=100&width=100",
//     color: "#FFF3E0",
//   },
//   {
//     id: 3,
//     type: "Oily",
//     description: "Overproduction of sebum",
//     characteristics: ["Shiny appearance", "Enlarged pores", "Prone to acne"],
//     image: "https://v0.dev/placeholder.svg?height=100&width=100",
//     color: "#F1F8E9",
//   },
//   {
//     id: 4,
//     type: "Combination",
//     description: "Combination of oily and dry areas",
//     characteristics: [
//       "Oily T-zone",
//       "Dry cheeks",
//       "Enlarged pores in some areas",
//     ],
//     image: "https://v0.dev/placeholder.svg?height=100&width=100",
//     color: "#E8EAF6",
//   },
//   {
//     id: 5,
//     type: "Sensitive",
//     description: "Easily irritated by environmental factors",
//     characteristics: ["Redness", "Itching", "Burning sensation"],
//     image: "https://v0.dev/placeholder.svg?height=100&width=100",
//     color: "#FCE4EC",
//   },
// ];

export default function SkinTestScreen() {
  const router = useRouter();
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<SkinTestQuestion[]>([]);
  const [currentTest, setCurrentTest] = useState<SkinTestType | null>(null);
  const [guestId, setGuestId] = useState<number | null>(null);
  const [currentAnswer, setCurrentAnswer] = useState<string | null>(null);
  const [answerId, setAnswerId] = useState<number | null>(null);
  const [customerInfo, setCustomerInfo] = useState<{
    customerId: number | null;
    email: string;
    fullName: string;
    phone: string;
  }>({
    customerId: null,
    email: "",
    fullName: "",
    phone: "",
  });
  const [resultStatus, setResultStatus] = useState<
    "loading" | "success" | "error" | "waiting" | "pending" | null
  >(null);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 12; // Số lần thử tối đa (1 phút với interval 5 giây)

  useEffect(() => {
    loadCustomerInfo();
    loadSkinTest();
  }, []);

  const loadCustomerInfo = async () => {
    try {
      // Thử lấy profile từ API trước
      const profileResponse = await api.auth.getProfile();
      console.log("Account Profile from API:", profileResponse);

      // Kiểm tra nếu có data từ API
      if (profileResponse?.data?.accountId) {
        const customerInfo = {
          customerId: profileResponse.data.accountId, // Lấy accountId từ response data
          email: profileResponse.data.email || "",
          fullName: profileResponse.data.accountInfo?.fullName || "",
          phone: profileResponse.data.accountInfo?.phone || "0353066296",
        };

        console.log("Setting customer info from API:", customerInfo);
        setCustomerInfo(customerInfo);
        return;
      }

      // Fallback to AsyncStorage nếu không có data từ API
      const profileData = await AsyncStorage.getItem("userProfile");
      console.log("Profile Data from AsyncStorage:", profileData);

      if (profileData) {
        const profile = JSON.parse(profileData);
        console.log("Parsed Profile from Storage:", profile);

        // Nếu không có accountId trong storage, thử lấy lại từ API
        if (!profile.accountId) {
          try {
            const apiProfile = await api.auth.getProfile();
            if (apiProfile?.data?.accountId) {
              profile.accountId = apiProfile.data.accountId;
            }
          } catch (error) {
            console.error("Error getting accountId from API:", error);
          }
        }

        const customerInfo = {
          customerId: profile.accountId, // Sử dụng accountId từ storage hoặc API
          email: profile.email || "",
          fullName: profile.fullName || "",
          phone: profile.phone || "0353066296",
        };

        console.log("Setting customer info from Storage:", customerInfo);
        setCustomerInfo(customerInfo);

        // Update storage với accountId mới nếu cần
        if (profile.accountId) {
          await AsyncStorage.setItem(
            "userProfile",
            JSON.stringify({
              ...profile,
              accountId: profile.accountId,
            })
          );
        }
      } else {
        console.log("No profile data found");
        // Thử lấy lại từ API một lần nữa
        try {
          const apiProfile = await api.auth.getProfile();
          if (apiProfile?.data?.accountId) {
            const customerInfo = {
              customerId: apiProfile.data.accountId,
              email: apiProfile.data.email || "",
              fullName: apiProfile.data.accountInfo?.fullName || "",
              phone: apiProfile.data.accountInfo?.phone || "0353066296",
            };
            setCustomerInfo(customerInfo);

            // Lưu vào storage
            await AsyncStorage.setItem(
              "userProfile",
              JSON.stringify(customerInfo)
            );
          }
        } catch (error) {
          console.error("Final attempt to get profile failed:", error);
          setCustomerInfo({
            customerId: null,
            email: "",
            fullName: "",
            phone: "0353066296",
          });
        }
      }
    } catch (error) {
      console.error("Error in loadCustomerInfo:", error);
      setCustomerInfo({
        customerId: null,
        email: "",
        fullName: "",
        phone: "0353066296",
      });
    }
  };

  const loadSkinTest = async () => {
    try {
      setLoading(true);
      // Lấy danh sách skin test
      const skinTests = await api.skinTest.getSkinTests();
      console.log("Loaded skin tests:", skinTests);

      if (skinTests && skinTests.length > 0) {
        const firstTest = skinTests[0];
        setCurrentTest(firstTest);

        // Lấy câu hỏi cho test này
        const questions = await api.skinTestQuestions.getQuestionsBySkinTest(
          firstTest.skinTestId
        );
        console.log("Loaded questions:", questions);

        if (Array.isArray(questions)) {
          setQuestions(questions);
        } else {
          console.error("Questions data is not an array:", questions);
        }
      }
    } catch (error) {
      console.error("Error loading skin test:", error);
    } finally {
      setLoading(false);
    }
  };

  // Thêm hàm format tên
  const formatFullName = (name: string) => {
    // Loại bỏ khoảng trắng thừa và chuyển đổi thành title case
    return name
      .trim()
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const handleAnswer = async (answer: string) => {
    if (answers.length >= questions.length) {
      console.log("All questions answered");
      return;
    }

    setCurrentAnswer(answer);

    setTimeout(async () => {
      const answerLetter = answer.slice(-1);
      console.log("Answer letter:", answerLetter);

      const newAnswers = [...answers, answerLetter];
      setAnswers(newAnswers);
      setCurrentAnswer(null);

      if (currentQuestion === questions.length - 1) {
        try {
          setLoading(true);
          setResultStatus("loading");

          const submitData = {
            skinTestId: currentTest?.skinTestId || 0,
            customerId: customerInfo.customerId,
            email: customerInfo.email.trim(),
            fullName: customerInfo.fullName.trim(),
            phone: customerInfo.phone.trim() || "0353066296",
            answers: newAnswers.map((ans) => ans.toUpperCase()),
          };

          const submitResponse = await api.skinTest.submitAnswers(submitData);

          if (submitResponse?.answerId) {
            setAnswerId(submitResponse.answerId);
            setResultStatus("waiting");
            setResult(
              "Cảm ơn bạn đã hoàn thành bài test. Chuyên gia của chúng tôi đang phân tích kết quả của bạn."
            );

            // Thử lấy kết quả lần đầu
            try {
              const resultResponse = await api.skinTest.getTestResult(
                submitResponse.answerId
              );

              if (resultResponse?.result) {
                setResult(resultResponse.result);
                setResultStatus("success");
              } else {
                // Nếu chưa có kết quả, bắt đầu polling một cách im lặng
                let retries = 0;
                const maxRetries = 20;

                const checkInterval = setInterval(async () => {
                  if (retries >= maxRetries) {
                    clearInterval(checkInterval);
                    setResult(
                      "Kết quả của bạn đang được chuyên gia phân tích. Chúng tôi sẽ gửi email thông báo khi có kết quả."
                    );
                    setResultStatus("pending");
                    return;
                  }

                  try {
                    const newResult = await api.skinTest.getTestResult(
                      submitResponse.answerId
                    );

                    if (newResult?.result) {
                      setResult(newResult.result);
                      setResultStatus("success");
                      clearInterval(checkInterval);
                    } else {
                      retries++;
                    }
                  } catch {
                    // Bỏ qua lỗi một cách im lặng
                    retries++;
                  }
                }, 5000);

                // Cleanup interval sau 1 phút
                setTimeout(() => {
                  clearInterval(checkInterval);
                  if (resultStatus === "waiting") {
                    setResult(
                      "Kết quả của bạn đang được chuyên gia phân tích. Chúng tôi sẽ gửi email thông báo khi có kết quả."
                    );
                    setResultStatus("pending");
                  }
                }, 60000);

                // Hiển thị trạng thái chờ cho người dùng
                setResult(
                  "Kết quả của bạn đang được chuyên gia phân tích. Vui lòng đợi trong giây lát..."
                );
                setResultStatus("waiting");
              }
            } catch {
              // Nếu có lỗi, chuyển sang trạng thái pending mà không hiển thị lỗi
              setResult(
                "Kết quả của bạn đang được chuyên gia phân tích. Chúng tôi sẽ gửi email thông báo khi có kết quả."
              );
              setResultStatus("pending");
            }
          }
        } catch (error) {
          console.error("Submit error:", error);
          setResultStatus("error");
          setResult("Có lỗi xảy ra khi gửi bài test. Vui lòng thử lại sau.");
        } finally {
          setLoading(false);
        }
      } else {
        setCurrentQuestion(currentQuestion + 1);
      }
    }, 500);
  };

  const resetQuiz = () => {
    setShowQuiz(false);
    setCurrentQuestion(0);
    setAnswers([]);
    setResult(null);
  };

  const renderQuestion = (question: SkinTestQuestion) => {
    if (answers.length >= questions.length) {
      return null;
    }

    return (
      <View style={styles.questionContainer} key={question.skinTestQuestionId}>
        <Text style={styles.questionText}>
          Question {currentQuestion + 1} of {questions.length}:{" "}
          {question.questionText}
        </Text>
        <View style={styles.optionsContainer}>
          {[
            { key: "optionA", label: "A", value: question.optionA },
            { key: "optionB", label: "B", value: question.optionB },
            { key: "optionC", label: "C", value: question.optionC },
            { key: "optionD", label: "D", value: question.optionD },
          ].map((option) => (
            <TouchableOpacity
              key={option.key}
              style={[
                styles.optionButton,
                currentAnswer === option.key && styles.selectedOption,
              ]}
              onPress={() => handleAnswer(option.key)}
              disabled={currentAnswer !== null}
            >
              <View style={styles.optionRow}>
                <Text
                  style={[
                    styles.optionLabel,
                    currentAnswer === option.key && styles.selectedOptionText,
                  ]}
                >
                  {option.label}
                </Text>
                <Text
                  style={[
                    styles.optionText,
                    currentAnswer === option.key && styles.selectedOptionText,
                  ]}
                >
                  {option.value}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  // Thêm function để parse kết quả
  const formatResult = (resultString: string) => {
    try {
      const resultData = JSON.parse(resultString);
      return {
        treatmentId: resultData.treatmentId,
        serviceId: resultData.serviceId,
        treatmentName: resultData.treatmentName,
        description: resultData.description,
        duration: resultData.duration,
        price: resultData.price,
        message: resultData.message,
        isAvailable: resultData.isAvailable,
      };
    } catch (error) {
      console.error("Error parsing result:", error);
      return null;
    }
  };

  const renderResult = () => {
    switch (resultStatus) {
      case "loading":
        return (
          <View style={styles.resultContainer}>
            <ActivityIndicator size="large" color="#A83F98" />
            <Text style={styles.loadingText}>
              Đang xử lý bài test của bạn...
            </Text>
          </View>
        );

      case "waiting":
      case "pending":
        return (
          <View style={styles.resultContainer}>
            <Text style={styles.resultTitle}>Đang chờ kết quả</Text>
            <Text style={styles.resultText}>{result}</Text>
            <Text style={styles.emailNote}>
              Chúng tôi sẽ gửi email thông báo ngay khi có kết quả phân tích từ
              chuyên gia.
            </Text>
          </View>
        );

      case "success":
        const formattedResult = formatResult(result);
        if (!formattedResult) {
          return (
            <View style={styles.resultContainer}>
              <Text style={styles.resultTitle}>Có lỗi xử lý kết quả</Text>
              <TouchableOpacity style={styles.retakeButton} onPress={resetQuiz}>
                <Text style={styles.retakeButtonText}>Thử lại</Text>
              </TouchableOpacity>
            </View>
          );
        }

        return (
          <View style={styles.resultContainer}>
            <Text style={styles.resultTitle}>
              Dịch vụ dựa trên kết quả phân tích da của bạn
            </Text>

            <View style={styles.resultCard}>
              <View style={styles.treatmentHeader}>
                <Ionicons name="medical-outline" size={24} color="#A83F98" />
                <Text style={styles.treatmentName}>
                  {formattedResult.treatmentName}
                </Text>
              </View>

              <View style={styles.resultInfoContainer}>
                <View style={styles.resultInfoItem}>
                  <Ionicons name="time-outline" size={20} color="#666" />
                  <Text style={styles.resultInfoText}>
                    Thời gian điều trị: {formattedResult.duration} phút
                  </Text>
                </View>

                <View style={styles.resultInfoItem}>
                  <Ionicons name="cash-outline" size={20} color="#666" />
                  <Text style={styles.resultInfoText}>
                    Chi phí điều trị:{" "}
                    {new Intl.NumberFormat("vi-VN").format(
                      formattedResult.price
                    )}
                    đ
                  </Text>
                </View>

                <View style={styles.resultInfoItem}>
                  <Ionicons
                    name={
                      formattedResult.isAvailable
                        ? "checkmark-circle-outline"
                        : "close-circle-outline"
                    }
                    size={20}
                    color={formattedResult.isAvailable ? "#4CAF50" : "#F44336"}
                  />
                  <Text
                    style={[
                      styles.resultInfoText,
                      {
                        color: formattedResult.isAvailable
                          ? "#4CAF50"
                          : "#F44336",
                      },
                    ]}
                  >
                    {formattedResult.isAvailable
                      ? "Có sẵn để điều trị"
                      : "Tạm thời không có sẵn"}
                  </Text>
                </View>
              </View>

              {formattedResult.description && (
                <View style={styles.descriptionContainer}>
                  <Text style={styles.descriptionTitle}>
                    Đề xuất của chuyên gia:
                  </Text>
                  <Text style={styles.descriptionText}>
                    {formattedResult.description}
                  </Text>
                </View>
              )}

              {formattedResult.message && (
                <View style={styles.messageContainer}>
                  <Text style={styles.messageText}>
                    "{formattedResult.message}"
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.resultActionsContainer}>
              <TouchableOpacity
                style={[styles.actionButton, styles.primaryButton]}
                onPress={() => router.push("/recommended-products")}
              >
                <Text style={styles.actionButtonText}>
                  Xem sản phẩm được đề xuất
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.secondaryButton]}
                onPress={resetQuiz}
              >
                <View style={styles.buttonContent}>
                  <Ionicons name="refresh-outline" size={20} color="#A83F98" />
                  <Text
                    style={[
                      styles.actionButtonText,
                      styles.secondaryButtonText,
                    ]}
                  >
                    Làm lại bài test
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.outlineButton]}
                onPress={() => router.push("/skin-guide")}
              >
                <Text
                  style={[styles.actionButtonText, styles.outlineButtonText]}
                >
                  Đọc Hướng Dẫn Chăm Sóc Da
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      case "error":
        return (
          <View style={styles.resultContainer}>
            <Text style={styles.resultTitle}>Có lỗi xảy ra</Text>
            <Text style={styles.resultText}>{result}</Text>
            <TouchableOpacity style={styles.retakeButton} onPress={resetQuiz}>
              <Text style={styles.retakeButtonText}>Thử lại</Text>
            </TouchableOpacity>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#f6e7ff", "#ffffff"]} style={styles.gradient}>
        <View style={styles.header}>
          <Text style={styles.title}>Skin Analysis</Text>
          <TouchableOpacity onPress={() => router.push("/skin-guide")}>
            <Text style={styles.viewAll}>Guide</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#A83F98" />
            <Text style={styles.loadingText}>Loading your skin test...</Text>
          </View>
        ) : !showQuiz && result === null ? (
          <View style={styles.introContainer}>
            <Image
              source={{
                uri: "https://img.freepik.com/free-vector/hand-drawn-skin-care-steps-illustration_23-2149211376.jpg",
              }}
              style={styles.introImage}
              onError={(error) => {
                console.log("Error loading image:", error);
              }}
            />
            <Text style={styles.introTitle}>Discover Your Skin Type</Text>
            <Text style={styles.introText}>
              Take our advanced skin analysis quiz to receive personalized
              skincare recommendations.
            </Text>
            <TouchableOpacity
              style={styles.startButtonText}
              onPress={() => setShowQuiz(true)}
            >
              <LinearGradient
                colors={["#A83F98", "#7B2C8C"]}
                style={styles.gradientButton}
              >
                <Text style={styles.startButtonText}>Start Analysis</Text>
                <Ionicons name="arrow-forward" size={20} color="white" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : showQuiz && result === null ? (
          <ScrollView style={styles.quizContainer}>
            {questions.length > 0 && renderQuestion(questions[currentQuestion])}
          </ScrollView>
        ) : (
          <ScrollView style={styles.quizContainer}>{renderResult()}</ScrollView>
        )}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  gradient: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    paddingTop: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  viewAll: {
    fontSize: 16,
    color: "#A83F98",
    fontWeight: "600",
  },
  introContainer: {
    alignItems: "center",
    padding: 24,
    backgroundColor: "white",
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  introImage: {
    width: width * 0.6,
    height: width * 0.6,
    marginBottom: 24,
  },
  introTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 12,
    textAlign: "center",
  },
  introText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 24,
  },
  gradientButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    width: "100%",
  },
  startButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    marginRight: 8,
  },
  quizContainer: {
    flex: 1,
    padding: 20,
  },
  questionContainer: {
    padding: 20,
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  questionText: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
    color: "#333",
  },
  optionsContainer: {
    gap: 10,
  },
  optionButton: {
    backgroundColor: "#f6e7ff",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#A83F98",
    marginRight: 12,
    width: 24,
    textAlign: "center",
  },
  optionText: {
    fontSize: 16,
    color: "#333",
    textAlign: "left",
  },
  resultContainer: {
    padding: 20,
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 16,
    color: "#1a1a1a",
  },
  resultText: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
  },
  retakeButton: {
    backgroundColor: "#A83F98",
    padding: 16,
    borderRadius: 30,
    width: "100%",
    alignItems: "center",
  },
  retakeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 16,
  },
  selectedOption: {
    backgroundColor: "#A83F98",
    borderColor: "#A83F98",
  },
  selectedOptionText: {
    color: "white",
  },
  resultActionsContainer: {
    width: "100%",
    gap: 12,
    marginTop: 24,
  },
  actionButton: {
    padding: 16,
    borderRadius: 30,
    width: "100%",
    alignItems: "center",
  },
  primaryButton: {
    backgroundColor: "#A83F98",
  },
  secondaryButton: {
    backgroundColor: "#f6e7ff",
  },
  outlineButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#A83F98",
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
  secondaryButtonText: {
    color: "#A83F98",
  },
  outlineButtonText: {
    color: "#A83F98",
  },
  resultSubText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginVertical: 12,
  },
  emailNote: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 16,
    fontStyle: "italic",
  },
  resultCard: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginVertical: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  treatmentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  treatmentName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#A83F98",
    marginLeft: 12,
  },
  resultInfoContainer: {
    marginBottom: 16,
  },
  resultInfoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
    backgroundColor: "#f8f8f8",
    padding: 12,
    borderRadius: 8,
  },
  resultInfoText: {
    fontSize: 16,
    color: "#666",
    marginLeft: 8,
    flex: 1,
  },
  descriptionContainer: {
    backgroundColor: "#f8f8f8",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 15,
    color: "#666",
    lineHeight: 22,
  },
  messageContainer: {
    alignItems: "center",
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  messageText: {
    fontSize: 16,
    fontStyle: "italic",
    color: "#A83F98",
    textAlign: "center",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});
