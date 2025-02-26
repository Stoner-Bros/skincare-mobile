import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const skinTypes = [
  {
    id: 1,
    type: "Normal",
    description: "Well-balanced: neither too oily nor too dry",
    characteristics: ["Smooth texture", "Few imperfections", "Small pores"],
    image: "https://v0.dev/placeholder.svg?height=100&width=100",
    color: "#E0F7FA",
  },
  {
    id: 2,
    type: "Dry",
    description: "Produces less sebum than normal skin",
    characteristics: ["Rough texture", "Red patches", "Less elasticity"],
    image: "https://v0.dev/placeholder.svg?height=100&width=100",
    color: "#FFF3E0",
  },
  {
    id: 3,
    type: "Oily",
    description: "Overproduction of sebum",
    characteristics: ["Shiny appearance", "Enlarged pores", "Prone to acne"],
    image: "https://v0.dev/placeholder.svg?height=100&width=100",
    color: "#F1F8E9",
  },
  {
    id: 4,
    type: "Combination",
    description: "Combination of oily and dry areas",
    characteristics: [
      "Oily T-zone",
      "Dry cheeks",
      "Enlarged pores in some areas",
    ],
    image: "https://v0.dev/placeholder.svg?height=100&width=100",
    color: "#E8EAF6",
  },
  {
    id: 5,
    type: "Sensitive",
    description: "Easily irritated by environmental factors",
    characteristics: ["Redness", "Itching", "Burning sensation"],
    image: "https://v0.dev/placeholder.svg?height=100&width=100",
    color: "#FCE4EC",
  },
];

export default function SkinTest() {
  const router = useRouter();
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<number | null>(null);

  const questions = [
    {
      question: "How does your skin feel after cleansing?",
      options: [
        "Comfortable and normal",
        "Tight and dry",
        "Still oily or shiny",
        "Tight in some areas, oily in others",
        "Irritated or red",
      ],
    },
    {
      question: "How often do you experience breakouts?",
      options: [
        "Rarely",
        "Occasionally when very dry",
        "Frequently, especially in the T-zone",
        "Sometimes in specific areas",
        "When exposed to certain products",
      ],
    },
    {
      question: "How visible are your pores?",
      options: [
        "Barely visible",
        "Not very visible",
        "Very visible, especially in the T-zone",
        "Visible in some areas, not in others",
        "Varies depending on skin reactivity",
      ],
    },
    {
      question: "How does your skin react to new products?",
      options: [
        "Usually adapts well",
        "Often feels drier",
        "Often becomes oilier",
        "Reacts differently in different areas",
        "Frequently becomes irritated",
      ],
    },
    {
      question: "By mid-day, how does your skin look?",
      options: [
        "Pretty much the same as morning",
        "Flaky or tight",
        "Shiny and oily",
        "Oily in T-zone, normal/dry elsewhere",
        "Possibly red or irritated",
      ],
    },
  ];

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers, answerIndex];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate result
      const counts = [0, 0, 0, 0, 0]; // For each skin type
      newAnswers.forEach((answer) => {
        counts[answer]++;
      });

      // Find the most common answer (skin type)
      let maxCount = 0;
      let maxIndex = 0;
      counts.forEach((count, index) => {
        if (count > maxCount) {
          maxCount = count;
          maxIndex = index;
        }
      });

      setResult(maxIndex);
    }
  };

  const resetQuiz = () => {
    setShowQuiz(false);
    setCurrentQuestion(0);
    setAnswers([]);
    setResult(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Skin Type Test</Text>
        <TouchableOpacity onPress={() => router.push("/skin-guide")}>
          <Text style={styles.viewAll}>Skin Care Guide</Text>
        </TouchableOpacity>
      </View>

      {!showQuiz && result === null && (
        <View style={styles.introContainer}>
          <Image
            source={{
              uri: "https://v0.dev/placeholder.svg?height=200&width=200",
            }}
            style={styles.introImage}
          />
          <Text style={styles.introTitle}>Discover Your Skin Type</Text>
          <Text style={styles.introText}>
            Take our quick 5-question quiz to identify your skin type and get
            personalized treatment recommendations.
          </Text>
          <TouchableOpacity
            style={styles.startButton}
            onPress={() => setShowQuiz(true)}
          >
            <Text style={styles.startButtonText}>Start Quiz</Text>
          </TouchableOpacity>
        </View>
      )}

      {showQuiz && result === null && (
        <View style={styles.quizContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${((currentQuestion + 1) / questions.length) * 100}%`,
                },
              ]}
            />
          </View>
          <Text style={styles.questionNumber}>
            Question {currentQuestion + 1}/{questions.length}
          </Text>
          <Text style={styles.questionText}>
            {questions[currentQuestion].question}
          </Text>

          <ScrollView style={styles.optionsContainer}>
            {questions[currentQuestion].options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.optionButton}
                onPress={() => handleAnswer(index)}
              >
                <Text style={styles.optionText}>{option}</Text>
                <Ionicons name="chevron-forward" size={20} color="#ccc" />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {result !== null && (
        <View style={styles.resultContainer}>
          <View
            style={[
              styles.resultHeader,
              { backgroundColor: skinTypes[result].color },
            ]}
          >
            <Image
              source={{ uri: skinTypes[result].image }}
              style={styles.resultImage}
            />
            <View style={styles.resultTitleContainer}>
              <Text style={styles.resultType}>Your Skin Type:</Text>
              <Text style={styles.resultTitle}>{skinTypes[result].type}</Text>
            </View>
          </View>

          <Text style={styles.resultDescription}>
            {skinTypes[result].description}
          </Text>

          <View style={styles.characteristicsContainer}>
            <Text style={styles.characteristicsTitle}>Characteristics:</Text>
            {skinTypes[result].characteristics.map((characteristic, index) => (
              <View key={index} style={styles.characteristicItem}>
                <Ionicons name="checkmark-circle" size={16} color="#2ecc71" />
                <Text style={styles.characteristicText}>{characteristic}</Text>
              </View>
            ))}
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.recommendButton}
              onPress={() =>
                router.push(`/treatments/recommended/${result + 1}`)
              }
            >
              <Text style={styles.recommendButtonText}>
                View Recommended Treatments
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.retakeButton} onPress={resetQuiz}>
              <Text style={styles.retakeButtonText}>Retake Quiz</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "white",
    borderRadius: 16,
    margin: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
  },
  viewAll: {
    fontSize: 14,
    color: "#2ecc71",
    fontWeight: "500",
  },
  introContainer: {
    alignItems: "center",
    padding: 16,
  },
  introImage: {
    width: 150,
    height: 150,
    marginBottom: 16,
  },
  introTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
  introText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
  },
  startButton: {
    backgroundColor: "#2ecc71",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  startButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  quizContainer: {
    padding: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: "#f1f1f1",
    borderRadius: 4,
    marginBottom: 16,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#2ecc71",
    borderRadius: 4,
  },
  questionNumber: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  questionText: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 24,
  },
  optionsContainer: {
    maxHeight: 300,
  },
  optionButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
  resultContainer: {
    padding: 16,
  },
  resultHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  resultImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  resultTitleContainer: {
    flex: 1,
  },
  resultType: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: "700",
  },
  resultDescription: {
    fontSize: 16,
    color: "#333",
    marginBottom: 24,
  },
  characteristicsContainer: {
    marginBottom: 24,
  },
  characteristicsTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  characteristicItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  characteristicText: {
    fontSize: 14,
    color: "#333",
    marginLeft: 8,
  },
  actionButtons: {
    gap: 12,
  },
  recommendButton: {
    backgroundColor: "#2ecc71",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  recommendButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  retakeButton: {
    backgroundColor: "#f1f1f1",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  retakeButtonText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "500",
  },
});
