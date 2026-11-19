export interface Testimonial {
  name: string;
  meta: string;
  rating: number;
  /** Paragraphs */
  body: string[];
}

export const googleRating = {
  score: "5.0",
  count: 3,
  reviewUrl: "https://g.page/r/", // TODO: Google Business review link
};

export const testimonials: Testimonial[] = [
  {
    name: "Supun Senarath",
    meta: "3 months ago · Absoliq",
    rating: 5,
    body: [
      "We worked with Vinod to design our website for Absoliq, and the experience was really good from start to finish.",
      "What stood out was that they actually understood what we needed and gave a unique solution, not just a pretty template. Communication also was clear throughout. He helped us to get the exact UI output we expected.",
      "We are so much happy with the output and the way he delivered and also the way he made very valid points without just agreeing with us. Would work with him again for sure.",
    ],
  },
  {
    name: "Chamila Rathnayake",
    meta: "2 years ago",
    rating: 5,
    body: [
      "Vinod's design work is outstanding. He has a keen eye for aesthetics and a deep understanding of user experience principles, which he seamlessly integrated into our website. The result is a visually stunning and highly functional website that not only meets but exceeds our expectations.",
      "Throughout the project, Vinod maintained clear and consistent communication and professionalism, ensuring that our vision was accurately captured and implemented. His ability to translate our ideas into a cohesive and engaging design was truly impressive. He was receptive to feedback and made adjustments swiftly, showcasing his commitment to delivering the best possible product. Keep up the good work Vinod.",
      "Cheers",
      "Chamila",
    ],
  },
  {
    name: "Bhaddiya Dodangoda",
    meta: "2 years ago",
    rating: 5,
    body: [
      "I had the pleasure of working with Vinod on our recent website developed for spiritual content, and I was hyper impressed with the design he delivered. The UX/UI design was delivered timely and exceeded our expectations in every way. The design is stunning and professional, showcasing a deep understanding of our needs and vision. I feel Vinod demonstrated exceptional skill, creativity, and attention to detail, ensuring that every aspect of the design was polished and user-friendly. Thank you very much for a job well done!",
    ],
  },
];
