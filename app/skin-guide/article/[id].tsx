import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import ChatSupportButton from "../../../components/common/ChatSupportButton";

// Sample article data
const articles = {
  "1": {
    title: "How to Build a Perfect Skincare Routine",
    image:
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    readTime: "5 min read",
    category: "Daily Routines",
    author: "Dr. Sarah Kim",
    date: "May 15, 2023",
    content: `
      A good skincare routine is essential for maintaining healthy, glowing skin. But with so many products and steps available, it can be overwhelming to know where to start. This guide will help you build a perfect skincare routine tailored to your needs.

      ## Morning Routine

      ### 1. Cleanse
      Start your day with a gentle cleanser to remove any oils or residue that built up overnight. Avoid harsh soaps that can strip your skin of natural oils.

      ### 2. Tone
      A good toner helps balance your skin's pH and prepares it for the next steps in your routine. Look for alcohol-free formulas with ingredients like glycerin or hyaluronic acid.

      ### 3. Serum
      Serums contain concentrated active ingredients that target specific concerns. Vitamin C serums are great for morning use as they provide antioxidant protection against environmental damage.

      ### 4. Moisturize
      Even oily skin needs hydration. Choose a lightweight moisturizer for oily skin or a richer cream for dry skin.

      ### 5. Sunscreen
      This is the most important step! Apply a broad-spectrum SPF 30+ sunscreen daily, even on cloudy days or when staying indoors.

      ## Evening Routine

      ### 1. Double Cleanse
      Start with an oil-based cleanser to remove makeup and sunscreen, followed by a water-based cleanser to clean the skin.

      ### 2. Exfoliate (2-3 times per week)
      Chemical exfoliants like AHAs or BHAs help remove dead skin cells and improve skin texture. Don't overdo it—2-3 times per week is sufficient.

      ### 3. Tone
      Just like in the morning, toning helps balance your skin.

      ### 4. Treatment
      Nighttime is ideal for more intensive treatments like retinol, which increases cell turnover and helps with fine lines and acne.

      ### 5. Moisturize
      Use a more nourishing moisturizer at night to support your skin's natural repair process while you sleep.

      ## Adjusting for Your Skin Type

      ### Dry Skin
      Focus on hydrating ingredients like hyaluronic acid, glycerin, and ceramides. Use richer creams and consider adding a facial oil.

      ### Oily Skin
      Look for non-comedogenic, lightweight formulas. Ingredients like niacinamide and salicylic acid can help control oil production.

      ### Combination Skin
      You might need to use different products on different areas of your face. Consider multi-masking or targeted treatments.

      ### Sensitive Skin
      Opt for fragrance-free, gentle formulations with soothing ingredients like centella asiatica or chamomile.

      Remember, consistency is key. It takes time to see results from skincare, so be patient and stick with your routine for at least 4-6 weeks before expecting significant changes.
    `,
    relatedArticles: ["2", "3"],
  },
  "2": {
    title: "Understanding Your Skin Type: A Comprehensive Guide",
    image:
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    readTime: "7 min read",
    category: "Skin Types",
    author: "Dr. James Chen",
    date: "April 3, 2023",
    content: `
      Knowing your skin type is the foundation of effective skincare. Different skin types have different needs, and using the wrong products can exacerbate skin issues rather than solve them.

      ## The Main Skin Types

      ### Normal Skin
      Normal skin is well-balanced—neither too oily nor too dry. It has:
      - Few imperfections
      - No severe sensitivity
      - Barely visible pores
      - A radiant complexion

      ### Dry Skin
      Dry skin produces less sebum than normal skin and may feel tight or rough. Characteristics include:
      - Almost invisible pores
      - Dull, rough complexion
      - Red patches
      - Less elasticity
      - More visible lines

      ### Oily Skin
      Oily skin produces excess sebum, making it shiny and thick. It has:
      - Enlarged pores
      - Shiny, thick complexion
      - Blackheads, pimples, or other blemishes

      ### Combination Skin
      Combination skin includes areas that are both dry and oily—typically oily in the T-zone (forehead, nose, and chin) and dry on the cheeks. It shows:
      - Pores that look larger than normal
      - Blackheads
      - Shiny skin
      - Dry patches

      ### Sensitive Skin
      Sensitive skin reacts easily to products or environmental factors. It may show:
      - Redness
      - Itching
      - Burning
      - Dryness

      ## How to Determine Your Skin Type

      ### The Bare-Face Method
      1. Cleanse your face with a mild cleanser
      2. Pat dry and wait 30 minutes
      3. Observe your skin:
         - If it feels tight, you likely have dry skin
         - If it's shiny all over, you likely have oily skin
         - If it's shiny in the T-zone but normal/dry elsewhere, you likely have combination skin
         - If it feels comfortable and balanced, you likely have normal skin

      ### The Blotting Sheet Method
      1. Pat a blotting paper on different areas of your face
      2. Hold the sheet up to the light to determine how much oil is visible
      3. If the sheet picked up little to no oil, you likely have dry skin
      4. If the sheet is saturated with oil, especially from the T-zone, you likely have oily or combination skin

      ## How Skin Type Can Change

      Your skin type isn't necessarily fixed for life. It can change due to:
      - Hormonal changes
      - Aging
      - Seasonal changes
      - Climate
      - Medications
      - Skincare products

      Understanding your current skin type helps you choose appropriate products and build an effective skincare routine. Remember to reassess periodically, especially if you notice changes in how your skin looks and feels.
    `,
    relatedArticles: ["1", "3"],
  },
  "3": {
    title: "The Science Behind Hyaluronic Acid",
    image:
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    readTime: "4 min read",
    category: "Ingredients",
    author: "Dr. Lisa Johnson",
    date: "June 22, 2023",
    content: `
      Hyaluronic acid has become one of the most popular ingredients in skincare—and for good reason. This powerful humectant can hold up to 1,000 times its weight in water, making it an excellent hydrator for the skin.

      ## What is Hyaluronic Acid?

      Hyaluronic acid (HA) is a glycosaminoglycan, a type of molecule naturally found in the skin, eyes, and connective tissues. In the skin, it's one of the main components of the extracellular matrix, which provides structural support.

      The primary function of HA in the skin is to retain water and keep tissues well lubricated and moist. As we age, our natural HA production decreases, which contributes to dryness and the formation of wrinkles.

      ## How Hyaluronic Acid Works

      When applied topically, hyaluronic acid works by drawing moisture from the environment and deeper layers of the skin to the surface layers where the HA is applied. This helps to:

      - Increase skin hydration
      - Improve skin elasticity
      - Reduce the appearance of fine lines and wrinkles
      - Create a plumping effect

      ## Different Molecular Weights

      Not all hyaluronic acid is created equal. The molecule comes in different sizes or "molecular weights":

      ### High Molecular Weight HA
      - Larger molecules that sit on the skin's surface
      - Creates a protective film
      - Provides immediate hydration and plumping
      - Cannot penetrate deeply

      ### Low Molecular Weight HA
      - Smaller molecules that can penetrate deeper into the skin
      - Provides longer-lasting hydration
      - Can help stimulate the skin's natural HA production
      - May have more anti-aging benefits

      Many advanced formulations contain a mix of different molecular weights for both immediate and long-term benefits.

      ## How to Use Hyaluronic Acid

      For best results:

      1. Apply to damp skin to give the HA molecules water to draw in
      2. Layer under a moisturizer to seal in the hydration
      3. Use both morning and night
      4. In dry climates, be sure to apply additional moisture, as HA can draw water from the skin if there's not enough environmental moisture

      ## Who Should Use Hyaluronic Acid?

      One of the best things about hyaluronic acid is that it works for all skin types:

      - Dry skin benefits from the intense hydration
      - Oily skin appreciates the lightweight, non-greasy hydration
      - Sensitive skin typically tolerates HA well as it's naturally occurring in the body
      - Aging skin benefits from the plumping effect on fine lines

      ## Combining with Other Ingredients

      Hyaluronic acid plays well with most other skincare ingredients and can enhance their effectiveness by ensuring the skin is well-hydrated. It works particularly well with:

      - Vitamin C for enhanced antioxidant protection
      - Retinol to mitigate potential dryness and irritation
      - Peptides for improved skin barrier function
      - AHAs and BHAs to balance their potentially drying effects

      By understanding how hyaluronic acid works, you can better incorporate it into your skincare routine for maximum benefits.
    `,
    relatedArticles: ["1", "2"],
  },
};

export default function ArticleDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const articleId = Array.isArray(id) ? id[0] : id;

  const article = articles[articleId as keyof typeof articles];

  if (!article) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Article Not Found</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            The article you're looking for doesn't exist.
          </Text>
          <TouchableOpacity
            style={styles.backToGuideButton}
            onPress={() => router.push("/skin-guide")}
          >
            <Text style={styles.backToGuideText}>Back to Skin Guide</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const renderContent = () => {
    const paragraphs = article.content.trim().split("\n\n");

    return paragraphs.map((paragraph, index) => {
      if (paragraph.startsWith("##")) {
        // Subheading
        return (
          <Text key={index} style={styles.subheading}>
            {paragraph.replace("## ", "")}
          </Text>
        );
      } else if (paragraph.startsWith("###")) {
        // Sub-subheading
        return (
          <Text key={index} style={styles.subSubheading}>
            {paragraph.replace("### ", "")}
          </Text>
        );
      } else if (paragraph.startsWith("-")) {
        // List item
        return (
          <View key={index} style={styles.listItem}>
            <Text style={styles.listItemBullet}>•</Text>
            <Text style={styles.listItemText}>
              {paragraph.replace("- ", "")}
            </Text>
          </View>
        );
      } else {
        // Regular paragraph
        return (
          <Text key={index} style={styles.paragraph}>
            {paragraph}
          </Text>
        );
      }
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Article</Text>
        <TouchableOpacity style={styles.shareButton}>
          <Ionicons name="share-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <Image source={{ uri: article.image }} style={styles.articleImage} />

        <View style={styles.articleContainer}>
          <View style={styles.categoryContainer}>
            <Text style={styles.category}>{article.category}</Text>
            <Text style={styles.readTime}>{article.readTime}</Text>
          </View>

          <Text style={styles.title}>{article.title}</Text>

          <View style={styles.authorContainer}>
            <View style={styles.authorAvatar}>
              <Text style={styles.authorInitials}>
                {article.author
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </Text>
            </View>
            <View>
              <Text style={styles.authorName}>{article.author}</Text>
              <Text style={styles.articleDate}>{article.date}</Text>
            </View>
          </View>

          <View style={styles.contentContainer}>{renderContent()}</View>

          {article.relatedArticles && article.relatedArticles.length > 0 && (
            <View style={styles.relatedArticlesContainer}>
              <Text style={styles.relatedArticlesTitle}>Related Articles</Text>

              {article.relatedArticles.map((relatedId) => {
                const relatedArticle =
                  articles[relatedId as keyof typeof articles];
                if (!relatedArticle) return null;

                return (
                  <TouchableOpacity
                    key={relatedId}
                    style={styles.relatedArticleCard}
                    onPress={() => {
                      router.push({
                        pathname: "/skin-guide/article/[id]",
                        params: { id: relatedId },
                      });
                    }}
                  >
                    <Image
                      source={{ uri: relatedArticle.image }}
                      style={styles.relatedArticleImage}
                    />
                    <View style={styles.relatedArticleContent}>
                      <Text style={styles.relatedArticleCategory}>
                        {relatedArticle.category}
                      </Text>
                      <Text style={styles.relatedArticleTitle}>
                        {relatedArticle.title}
                      </Text>
                      <Text style={styles.relatedArticleReadTime}>
                        {relatedArticle.readTime}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          <View style={styles.ctaContainer}>
            <TouchableOpacity
              style={styles.ctaButton}
              onPress={() => router.push("/booking/new")}
            >
              <Text style={styles.ctaButtonText}>Book a Consultation</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Chat Support Button */}
      <ChatSupportButton />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f1",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  shareButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  articleImage: {
    width: "100%",
    height: 250,
    resizeMode: "cover",
  },
  articleContainer: {
    padding: 16,
  },
  categoryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  category: {
    color: "#2ecc71",
    fontWeight: "500",
    fontSize: 14,
  },
  readTime: {
    color: "#999",
    fontSize: 14,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
    marginBottom: 16,
    lineHeight: 32,
  },
  authorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  authorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#2ecc71",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  authorInitials: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  authorName: {
    fontWeight: "600",
    fontSize: 14,
    color: "#333",
  },
  articleDate: {
    color: "#999",
    fontSize: 12,
  },
  contentContainer: {
    marginBottom: 24,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
    marginBottom: 16,
  },
  subheading: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginTop: 24,
    marginBottom: 16,
  },
  subSubheading: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginTop: 16,
    marginBottom: 12,
  },
  listItem: {
    flexDirection: "row",
    marginBottom: 8,
    paddingLeft: 8,
  },
  listItemBullet: {
    fontSize: 16,
    color: "#2ecc71",
    marginRight: 8,
  },
  listItemText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
  },
  relatedArticlesContainer: {
    marginTop: 24,
    marginBottom: 24,
  },
  relatedArticlesTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
  },
  relatedArticleCard: {
    flexDirection: "row",
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 12,
  },
  relatedArticleImage: {
    width: 80,
    height: 80,
  },
  relatedArticleContent: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
  },
  relatedArticleCategory: {
    fontSize: 12,
    color: "#2ecc71",
    fontWeight: "500",
  },
  relatedArticleTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginVertical: 4,
  },
  relatedArticleReadTime: {
    fontSize: 12,
    color: "#999",
  },
  ctaContainer: {
    marginTop: 16,
    marginBottom: 24,
  },
  ctaButton: {
    backgroundColor: "#2ecc71",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  ctaButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  backToGuideButton: {
    backgroundColor: "#2ecc71",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  backToGuideText: {
    color: "white",
    fontWeight: "600",
  },
});
