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

  useEffect(() => {
    loadSkinTest();
    // Generate random guestId for anonymous users
    setGuestId(Math.floor(Math.random() * 1000000));
  }, []);

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

  const handleAnswer = async (answer: string) => {
    // Kiểm tra nếu đã trả lời đủ số câu hỏi
    if (answers.length >= questions.length) {
      console.log("All questions answered");
      return;
    }

    // Set câu trả lời hiện tại
    setCurrentAnswer(answer);

    // Delay một chút để người dùng thấy được lựa chọn của mình
    setTimeout(async () => {
      console.log("Selected answer:", answer);
      const newAnswers = [...answers, answer.slice(-1)]; // Chỉ lấy ký tự cuối (A, B, C, D)
      setAnswers(newAnswers);
      setCurrentAnswer(null); // Reset current answer

      // Nếu là câu hỏi cuối cùng thì submit
      if (currentQuestion === questions.length - 1) {
        try {
          setLoading(true);

          // Format lại answers theo đúng yêu cầu API
          const submitData = {
            skinTestId: currentTest?.skinTestId || 0,
            customerId: null, // Thêm trường này
            guestId: guestId || 0,
            answers: newAnswers, // ["A", "B", "C", "D"]
          };

          console.log("Submitting answers:", submitData);

          // Gọi API submit answers
          const response = await api.skinTest.submitAnswers(submitData);
          console.log("Submit response:", response);

          // Nếu submit thành công, lấy kết quả ngay từ response
          if (response?.skinTestAnswerId) {
            try {
              // Gọi API lấy kết quả
              const resultResponse = await api.skinTest.getResult(
                response.skinTestAnswerId
              );
              console.log("Result response:", resultResponse);

              if (resultResponse?.result) {
                setResult(resultResponse.result);
              } else {
                setResult("Could not get your result. Please try again.");
              }
            } catch (resultError) {
              console.error("Error getting result:", resultError);
              setResult("Error getting your result. Please try again.");
            }
          }
        } catch (error: any) {
          console.error("Error submitting answers:", error);
          // Hiển thị lỗi chi tiết hơn
          const errorMessage =
            error.response?.data?.message ||
            error.message ||
            "Unknown error occurred";
          console.log("Error details:", {
            status: error.response?.status,
            data: error.response?.data,
            message: errorMessage,
          });
          setResult(`Error: ${errorMessage}`);
        } finally {
          setLoading(false);
        }
      } else {
        // Chuyển sang câu hỏi tiếp theo
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
          <View style={styles.resultContainer}>
            <Text style={styles.resultTitle}>Your Skin Analysis Result</Text>
            <Text style={styles.resultText}>{result}</Text>
            <TouchableOpacity style={styles.retakeButton} onPress={resetQuiz}>
              <Text style={styles.retakeButtonText}>Retake Test</Text>
            </TouchableOpacity>
          </View>
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
});
