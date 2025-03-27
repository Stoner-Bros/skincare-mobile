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
    "loading" | "success" | "error" | null
  >(null);

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

          // Log thông tin customer trước khi submit
          console.log("Current customer info:", customerInfo);

          // Validate dữ liệu trước khi gửi
          if (!customerInfo.email) {
            setResult("Email is required");
            return;
          }

          if (!customerInfo.fullName) {
            setResult("Full name is required");
            return;
          }

          // Thêm validation cho customerId
          if (!customerInfo.customerId) {
            console.warn("Customer ID is missing, attempting to get from API");
            try {
              // Thử lấy lại thông tin customer
              const profileResponse = await api.auth.getProfile();
              if (profileResponse?.accountId) {
                const customerResponse =
                  await api.customers.getCustomerByAccountId(
                    profileResponse.accountId
                  );
                if (customerResponse) {
                  setCustomerInfo((prev) => ({
                    ...prev,
                    customerId: customerResponse.customerId,
                  }));
                }
              }
            } catch (error) {
              console.error("Failed to fetch customer ID:", error);
            }
          }

          const submitData = {
            skinTestId: currentTest?.skinTestId || 0,
            customerId: customerInfo.customerId, // Đảm bảo có customerId
            email: customerInfo.email.trim(),
            fullName: customerInfo.fullName.trim(),
            phone: customerInfo.phone.trim() || "0353066296",
            answers: newAnswers.map((ans) => ans.toUpperCase()),
          };

          // Log để debug
          console.log("Customer info before submit:", customerInfo);
          console.log("Submit data:", submitData);

          // Kiểm tra lại một lần nữa trước khi gửi
          if (!submitData.customerId) {
            setResult(
              "Error: Customer ID is required. Please try again or contact support."
            );
            return;
          }

          try {
            setResultStatus("loading");
            const response = await api.skinTest.submitAnswers(submitData);
            console.log("Submit success:", response);

            if (response?.skinTestAnswerId) {
              const resultResponse = await api.skinTest.getResult(
                response.skinTestAnswerId
              );
              console.log("Result response:", resultResponse);
              setResult(resultResponse?.result || "Could not get result");
              setResultStatus("success");
            }
          } catch (error: any) {
            console.error("Submit error:", error);
            setResultStatus("error");

            // Parse error message nếu là JSON
            let errorMessage = error.message;
            try {
              const errorData = JSON.parse(error.message);
              errorMessage = Object.entries(errorData)
                .map(([key, value]) => `${key}: ${value}`)
                .join("\n");
            } catch {
              // Nếu không parse được JSON thì giữ nguyên message
            }

            setResult(`Error: ${errorMessage}`);
          }
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
          <ScrollView style={styles.quizContainer}>
            <View style={styles.resultContainer}>
              <Text style={styles.resultTitle}>Your Skin Analysis Result</Text>

              {resultStatus === "loading" ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#A83F98" />
                  <Text style={styles.loadingText}>
                    Analyzing your skin type...
                  </Text>
                </View>
              ) : resultStatus === "error" ? (
                <>
                  <Text style={styles.resultText}>{result}</Text>
                  <Text style={styles.resultSubText}>
                    Don't worry! You can try the test again or check your email
                    for the results later.
                  </Text>
                  <TouchableOpacity
                    style={styles.retakeButton}
                    onPress={resetQuiz}
                  >
                    <Text style={styles.retakeButtonText}>Retake Test</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Text style={styles.resultText}>{result}</Text>
                  <View style={styles.resultActionsContainer}>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.primaryButton]}
                      onPress={() => router.push("/recommended-products")}
                    >
                      <Text style={styles.actionButtonText}>
                        View Recommended Products
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.actionButton, styles.secondaryButton]}
                      onPress={resetQuiz}
                    >
                      <Text
                        style={[
                          styles.actionButtonText,
                          styles.secondaryButtonText,
                        ]}
                      >
                        Retake Test
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.actionButton, styles.outlineButton]}
                      onPress={() => router.push("/skin-guide")}
                    >
                      <Text
                        style={[
                          styles.actionButtonText,
                          styles.outlineButtonText,
                        ]}
                      >
                        Read Skin Care Guide
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.emailNote}>
                    We've sent detailed results to your email. Check your inbox
                    for personalized skin care recommendations!
                  </Text>
                </>
              )}
            </View>
          </ScrollView>
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
    marginTop: 24,
    fontStyle: "italic",
  },
});
