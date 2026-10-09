import "./Blog.css";

import { Link } from "react-router-dom";
import SpaOutlinedIcon from "@mui/icons-material/SpaOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import Blogcard3 from "../../assets/BlogBanner-img.avif";
import Blogcard1 from "../../assets/blogcard-img.jpg";
import Blogcard2 from "../../assets/blogcard02.jpg";
import Blogcard4 from "../../assets/blogcard03.avif";
import Blogcard5 from "../../assets/shop.jpeg";
import Blogcard6 from "../../assets/blogcard04.jpg";
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
        text: "Ayurveda is a traditional system of wellness that emphasizes balance in daily routines, mindful eating, adequate rest, and personal care. It encourages people to understand their individual needs and build sustainable habits.",
      },
      {
        heading: "Benefits of an Ayurvedic Lifestyle",
        text: "A balanced routine can include regular sleep, nutritious meals, gentle physical activity, breathing exercises, and time for relaxation. These habits can support general well-being and a more mindful lifestyle.",
      },
      {
        heading: "Simple Ayurvedic Habits",
        text: "Start your day with a consistent routine, eat meals mindfully, stay hydrated, and make time for movement and rest. Choose habits that suit your needs and seek qualified medical advice for health concerns.",
      },
      {
        heading: "Conclusion",
        text: "Ayurvedic principles can inspire a balanced approach to everyday living. Consistency and sensible lifestyle choices are more important than following complicated routines.",
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
        heading: "Introduction to Ayurveda",
        text: "Ayurveda is a traditional system of wellness that emphasizes balance in daily routines, mindful eating, adequate rest, and personal care. It encourages people to understand their individual needs and build sustainable habits.",
      },
      {
        heading: "Benefits of an Ayurvedic Lifestyle",
        text: "A balanced routine can include regular sleep, nutritious meals, gentle physical activity, breathing exercises, and time for relaxation. These habits can support general well-being and a more mindful lifestyle.",
      },
      {
        heading: "Simple Ayurvedic Habits",
        text: "Start your day with a consistent routine, eat meals mindfully, stay hydrated, and make time for movement and rest. Choose habits that suit your needs and seek qualified medical advice for health concerns.",
      },
      {
        heading: "Conclusion",
        text: "Ayurvedic principles can inspire a balanced approach to everyday living. Consistency and sensible lifestyle choices are more important than following complicated routines.",
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
        heading: "Introduction to Ayurveda",
        text: "Ayurveda is a traditional system of wellness that emphasizes balance in daily routines, mindful eating, adequate rest, and personal care. It encourages people to understand their individual needs and build sustainable habits.",
      },
      {
        heading: "Benefits of an Ayurvedic Lifestyle",
        text: "A balanced routine can include regular sleep, nutritious meals, gentle physical activity, breathing exercises, and time for relaxation. These habits can support general well-being and a more mindful lifestyle.",
      },
      {
        heading: "Simple Ayurvedic Habits",
        text: "Start your day with a consistent routine, eat meals mindfully, stay hydrated, and make time for movement and rest. Choose habits that suit your needs and seek qualified medical advice for health concerns.",
      },
      {
        heading: "Conclusion",
        text: "Ayurvedic principles can inspire a balanced approach to everyday living. Consistency and sensible lifestyle choices are more important than following complicated routines.",
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
        heading: "Introduction to Ayurveda",
        text: "Ayurveda is a traditional system of wellness that emphasizes balance in daily routines, mindful eating, adequate rest, and personal care. It encourages people to understand their individual needs and build sustainable habits.",
      },
      {
        heading: "Benefits of an Ayurvedic Lifestyle",
        text: "A balanced routine can include regular sleep, nutritious meals, gentle physical activity, breathing exercises, and time for relaxation. These habits can support general well-being and a more mindful lifestyle.",
      },
      {
        heading: "Simple Ayurvedic Habits",
        text: "Start your day with a consistent routine, eat meals mindfully, stay hydrated, and make time for movement and rest. Choose habits that suit your needs and seek qualified medical advice for health concerns.",
      },
      {
        heading: "Conclusion",
        text: "Ayurvedic principles can inspire a balanced approach to everyday living. Consistency and sensible lifestyle choices are more important than following complicated routines.",
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
        heading: "Introduction to Ayurveda",
        text: "Ayurveda is a traditional system of wellness that emphasizes balance in daily routines, mindful eating, adequate rest, and personal care. It encourages people to understand their individual needs and build sustainable habits.",
      },
      {
        heading: "Benefits of an Ayurvedic Lifestyle",
        text: "A balanced routine can include regular sleep, nutritious meals, gentle physical activity, breathing exercises, and time for relaxation. These habits can support general well-being and a more mindful lifestyle.",
      },
      {
        heading: "Simple Ayurvedic Habits",
        text: "Start your day with a consistent routine, eat meals mindfully, stay hydrated, and make time for movement and rest. Choose habits that suit your needs and seek qualified medical advice for health concerns.",
      },
      {
        heading: "Conclusion",
        text: "Ayurvedic principles can inspire a balanced approach to everyday living. Consistency and sensible lifestyle choices are more important than following complicated routines.",
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
        heading: "Introduction to Ayurveda",
        text: "Ayurveda is a traditional system of wellness that emphasizes balance in daily routines, mindful eating, adequate rest, and personal care. It encourages people to understand their individual needs and build sustainable habits.",
      },
      {
        heading: "Benefits of an Ayurvedic Lifestyle",
        text: "A balanced routine can include regular sleep, nutritious meals, gentle physical activity, breathing exercises, and time for relaxation. These habits can support general well-being and a more mindful lifestyle.",
      },
      {
        heading: "Simple Ayurvedic Habits",
        text: "Start your day with a consistent routine, eat meals mindfully, stay hydrated, and make time for movement and rest. Choose habits that suit your needs and seek qualified medical advice for health concerns.",
      },
      {
        heading: "Conclusion",
        text: "Ayurvedic principles can inspire a balanced approach to everyday living. Consistency and sensible lifestyle choices are more important than following complicated routines.",
      },
    ],
  },
];

function Blog() {
  return (
    <section className="blog-page">
      {" "}
      <div className="blog-hero">
        {" "}
        <div className="blog-hero-content">
          {" "}
          <span className="blog-eyebrow">
            {" "}
            <SpaOutlinedIcon />
            NATURAL WELLNESS JOURNAL{" "}
          </span>
          <h1>
            Discover the Wisdom of <span>Ayurveda</span>
          </h1>
          <p>
            Explore natural wellness tips, herbal remedies, skincare rituals,
            and timeless Ayurvedic knowledge for everyday living.
          </p>
          <a href="#blog-list" className="blog-explore-btn">
            Explore Articles <ArrowForwardIcon />
          </a>
        </div>
      </div>
      <div className="blog-container" id="blog-list">
        <div className="blog-section-heading">
          <div>
            <span className="blog-small-heading">OUR LATEST ARTICLES</span>
            <h2>From Our Wellness Journal</h2>
          </div>

          <p>Natural knowledge and inspiration for a healthier lifestyle.</p>
        </div>

        <div className="blog-grid">
          {blogs.map((blog) => (
            <Link
              to={`/blog/${blog.id}`}
              className="blog-card-link"
              key={blog.id}
            >
              <article className="blog-card">
                <div className="blog-image-wrapper">
                  <img src={blog.image} alt={blog.title} loading="lazy" />
                  <span className="blog-category">{blog.category}</span>
                </div>

                <div className="blog-card-content">
                  <div className="blog-meta">
                    <span>{blog.date}</span>

                    <span className="blog-read-time">
                      <AccessTimeOutlinedIcon />
                      {blog.time}
                    </span>
                  </div>

                  <h3>{blog.title}</h3>
                  <p>{blog.description}</p>

                  <span className="blog-read-more">
                    Read Article <ArrowForwardIcon />
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Blog;
