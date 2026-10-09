import { Link, useParams } from "react-router-dom";
import "./BlogDetails.css";

import SpaOutlinedIcon from "@mui/icons-material/SpaOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import Blogcard3 from "../../assets/BlogBanner-img.avif";
import Blogcard1 from "../../assets/blogcard-img.jpg";
import Blogcard2 from "../../assets/blogcard02.jpg";
import Blogcard4 from "../../assets/blogcard03.avif";
import Blogcard5 from "../../assets/shop.jpeg";
import Blogcard6 from "../../assets/blogcard04.jpg";

// Keep this data consistent with your Blog.jsx
const blogs = [
  {
    id: 1,
    category: "AYURVEDA",
    title: "Benefits of Ayurveda in Everyday Life",
    description:
      "Discover how ancient Ayurvedic practices can help you maintain a healthy and balanced lifestyle.",
    image: Blogcard3,
    date: "October 05, 2026",
    time: "5 min read",
    content: [
      {
        heading: "Introduction to Ayurveda",
        text: "Ayurveda is a traditional system of wellness that emphasizes balance in daily routines, mindful eating, adequate rest, and personal care.",
      },
      {
        heading: "Benefits of an Ayurvedic Lifestyle",
        text: "A balanced routine can include regular sleep, nutritious meals, gentle physical activity, and time for relaxation. These habits can support general well-being.",
      },
      {
        heading: "Simple Daily Habits",
        text: "Start your day with a consistent routine, eat mindfully, stay hydrated, and make time for movement and rest.",
      },
      {
        heading: "Conclusion",
        text: "Ayurvedic principles can inspire a balanced approach to everyday living. Choose habits that suit your needs and seek qualified medical advice for health concerns.",
      },
    ],
  },
  {
    id: 2,
    category: "HEALTH & WELLNESS",
    title: "Natural Ways to Boost Your Immunity",
    description:
      "Explore natural wellness habits and traditional ingredients that support your daily health routine.",
    image: Blogcard4,
    date: "October 02, 2026",
    time: "4 min read",
    content: [
      {
        heading: "Build Healthy Habits",
        text: "Good health starts with a balanced diet, sufficient sleep, regular physical activity, and everyday hygiene.",
      },
      {
        heading: "Eat a Balanced Diet",
        text: "Include a variety of vegetables, fruits, whole grains, and protein-rich foods. A varied diet helps provide essential nutrients.",
      },
      {
        heading: "Rest and Stay Active",
        text: "Maintain a consistent sleep schedule and choose physical activities that suit your fitness level.",
      },
      {
        heading: "Final Thoughts",
        text: "No single food or herbal product can guarantee immunity. Consult a qualified healthcare professional if you have health concerns.",
      },
    ],
  },
  {
    id: 3,
    category: "SKINCARE",
    title: "Ayurvedic Secrets for Healthy Glowing Skin",
    description:
      "Learn about traditional skincare ingredients and simple self-care rituals for your skin.",
    image: Blogcard5,
    date: "September 28, 2026",
    time: "6 min read",
    content: [
      {
        heading: "Understand Your Skin",
        text: "A simple skincare routine should suit your skin type and focus on gentle cleansing, moisturizing, and sun protection.",
      },
      {
        heading: "Traditional Ingredients",
        text: "Ingredients such as aloe vera are used in some skincare products. Their suitability varies, so check product labels and patch-test new products.",
      },
      {
        heading: "Daily Skincare Routine",
        text: "Cleanse gently, moisturize regularly, use broad-spectrum sunscreen, and avoid products that irritate your skin.",
      },
      {
        heading: "Conclusion",
        text: "Consistency and gentle skincare are useful foundations for healthy-looking skin.",
      },
    ],
  },
  {
    id: 4,
    category: "HERBAL CARE",
    title: "Why Herbal Ingredients Matter",
    description:
      "Understand the role of traditional herbs in personal care and everyday wellness products.",
    image: Blogcard2,
    date: "September 22, 2026",
    time: "3 min read",
    content: [
      {
        heading: "What Are Herbal Ingredients?",
        text: "Herbal ingredients are derived from plants and are used in a variety of traditional practices and personal care products.",
      },
      {
        heading: "Choosing Products Carefully",
        text: "Read ingredient labels, follow product directions, and check for possible allergies or skin sensitivities.",
      },
      {
        heading: "A Balanced Approach",
        text: "Natural does not automatically mean safe or effective for every person. Choose products carefully and consult a professional when needed.",
      },
    ],
  },
  {
    id: 5,
    category: "LIFESTYLE",
    title: "Simple Daily Habits for Better Wellness",
    description:
      "Build a balanced daily routine with mindful habits, nutritious food, and proper rest.",
    image: Blogcard1,
    date: "September 18, 2026",
    time: "5 min read",
    content: [
      {
        heading: "Start with a Routine",
        text: "A regular daily schedule can help you make time for meals, exercise, work, and relaxation.",
      },
      {
        heading: "Eat and Move Mindfully",
        text: "Choose balanced meals and include regular movement that you enjoy and can maintain.",
      },
      {
        heading: "Make Time for Rest",
        text: "Create a relaxing bedtime routine and aim for consistent, sufficient sleep.",
      },
      {
        heading: "Conclusion",
        text: "Small, realistic habits practiced consistently can support a more balanced lifestyle.",
      },
    ],
  },
  {
    id: 6,
    category: "AYURVEDA",
    title: "A Beginner's Guide to Ayurvedic Living",
    description:
      "Get introduced to traditional Ayurvedic principles and ways to incorporate them into daily life.",
    image: Blogcard6,
    date: "September 12, 2026",
    time: "7 min read",
    content: [
      {
        heading: "Understanding Ayurvedic Living",
        text: "Ayurvedic traditions emphasize daily routines, food choices, rest, and individual differences.",
      },
      {
        heading: "Create a Balanced Routine",
        text: "Build consistent habits around meals, sleep, personal care, and physical activity.",
      },
      {
        heading: "Make Informed Choices",
        text: "Research traditional practices carefully and discuss herbal products with a qualified professional, especially if you take medication.",
      },
      {
        heading: "Final Thoughts",
        text: "Begin with simple, sustainable changes and adapt your routine to your personal needs.",
      },
    ],
  },
];

function BlogDetails() {
  const { id } = useParams();
  const blog = blogs.find((item) => item.id === Number(id));

  if (!blog) {
    return (
      <div className="blog-not-found">
        <h2>Article Not Found</h2>
        <p>The blog article you are looking for does not exist.</p>
        <Link to="/Blog">Back to Blogs</Link>
      </div>
    );
  }

  return (
    <section className="blog-details-page">
      <div className="blog-details-container">
        <Link to="/Blog" className="blog-back-link">
          <ArrowBackIcon />
          Back to All Articles
        </Link>

        <div className="details-box">
          <div className="detail-img">
            <div className="blog-details-image">
              <img src={blog.image} alt={blog.title} />
            </div>
          </div>
          <div className="details-conten">
            <div className="blog-details-header">
              <span className="blog-details-category">
                <SpaOutlinedIcon />
                {blog.category}
              </span>

              <h1>{blog.title}</h1>
              <p className="blog-details-description">{blog.description}</p>

              <div className="blog-details-meta">
                <span>{blog.date}</span>
                <span>
                  <AccessTimeOutlinedIcon />
                  {blog.time}
                </span>
              </div>
            </div>

            <article className="blog-article-content">
              <p className="blog-article-intro">{blog.description}</p>

              {blog.content.map((section, index) => (
                <section className="blog-article-section" key={index}>
                  <h2>{section.heading}</h2>
                  <p>{section.text}</p>
                </section>
              ))}

              <div className="blog-details-footer">
                <SpaOutlinedIcon />
                <p>Live naturally. Feel balanced. Choose wellness every day.</p>
              </div>
            </article>

            <div className="blog-details-bottom">
              <Link to="/Blog" className="blog-back-link">
                <ArrowBackIcon />
                All Articles
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BlogDetails;
