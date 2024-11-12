const mockBooks = [
  {
    id: "1",
    title: "Reincarnated as a Sword",
    author: "Yuu Tanaka",
    image: "https://via.placeholder.com/150",
    description: "A thrilling journey of self-discovery and adventure.",
    chapters: [
      "Prologue",
      "Chapter One: The Beginning",
      "Chapter Two: The Journey",
    ],
    reviews: [
      { user: "Alice", comment: "An amazing read!", rating: 5 },
      { user: "Bob", comment: "Incredibly inspiring.", rating: 4 },
      { user: "Carol", comment: "Could have been better.", rating: 3 },
    ],
    rating: 4.3,
    category: "Fantasy",
    storyOverview:
      "A sword that gains consciousness embarks on an adventure to protect its wielder and discover its true purpose.",
  },
  {
    id: "2",
    title: "From Here to the Great Unknown",
    author: "Lisa Marie Presley",
    image: "https://via.placeholder.com/150",
    description: "A deep dive into the mysteries of the universe.",
    chapters: ["Chapter One: The Universe", "Chapter Two: Stars"],
    reviews: [
      { user: "Charlie", comment: "Mind-blowing content!", rating: 5 },
      { user: "David", comment: "Could not put it down.", rating: 5 },
      { user: "Ella", comment: "Fantastic read!", rating: 4 },
      { user: "Frank", comment: "A bit dense at times.", rating: 3 },
    ],
    rating: 4.8,
    category: "Science",
    storyOverview:
      "An exploration of cosmic wonders and the intricate tapestry of life in the universe.",
  },
  {
    id: "3",
    title: "The Apothecary Diaries",
    author: "Natsu Hyuuga",
    image: "https://via.placeholder.com/150",
    description: "An exploration of human relationships in the modern world.",
    chapters: [
      "Introduction",
      "Chapter One: Connections",
      "Chapter Two: Emotions",
    ],
    reviews: [
      { user: "Eve", comment: "Very relatable!", rating: 4 },
      { user: "Frank", comment: "A bit slow but worth it.", rating: 3 },
      { user: "Grace", comment: "Thought-provoking.", rating: 5 },
      { user: "Hank", comment: "Not my cup of tea.", rating: 2 },
    ],
    rating: 3.5,
    category: "Contemporary Fiction",
    storyOverview:
      "A deep dive into the complexities of human emotions and relationships in today's society.",
  },
  {
    id: "4",
    title: "The Sweetness Between Us",
    author: "Sarah Winifred Searle",
    image: "https://via.placeholder.com/150",
    description: "A historical novel that brings the past to life.",
    chapters: ["Chapter One: The Past", "Chapter Two: The Legacy"],
    reviews: [
      { user: "Ivy", comment: "Beautifully written.", rating: 5 },
      { user: "Jack", comment: "Learned a lot from it.", rating: 4 },
    ],
    rating: 4.5,
    category: "Historical Fiction",
    storyOverview:
      "A heartfelt tale set against the backdrop of significant historical events, exploring love and loss.",
  },
  {
    id: "5",
    title: "Death March to the Parallel World Rhapsody",
    author: "Hiro Ainana",
    image: "https://via.placeholder.com/150",
    description: "A fantasy adventure that transports you to another realm.",
    chapters: ["Chapter One: The Quest", "Chapter Two: The Battle"],
    reviews: [
      { user: "Kate", comment: "Exciting and fun!", rating: 5 },
      { user: "Leo", comment: "Could use more world-building.", rating: 3 },
    ],
    rating: 4.0,
    category: "Fantasy",
    storyOverview:
      "A software engineer finds himself in a fantasy world, battling monsters and uncovering secrets.",
  },
  {
    id: "6",
    title: "Lies He Told Me",
    author: "James Patterson",
    image: "https://via.placeholder.com/150",
    description: "A captivating tale of love and loss.",
    chapters: ["Chapter One: First Love", "Chapter Two: Heartbreak"],
    reviews: [
      { user: "Mona", comment: "Very emotional.", rating: 5 },
      { user: "Nate", comment: "Made me cry.", rating: 4 },
    ],
    rating: 4.7,
    category: "Romance",
    storyOverview:
      "A poignant story about love, betrayal, and the strength to move on.",
  },
  {
    id: "7",
    title: "Absolute Batman (2024-) #1",
    author: "Scott Snyder",
    image: "https://via.placeholder.com/150",
    description: "A gripping mystery that keeps you guessing.",
    chapters: ["Chapter One: The Crime", "Chapter Two: The Investigation"],
    reviews: [
      { user: "Owen", comment: "Couldn't guess the ending!", rating: 5 },
      { user: "Paula", comment: "A true page-turner.", rating: 4 },
    ],
    rating: 4.6,
    category: "Comics",
    storyOverview:
      "Batman faces new foes while uncovering dark secrets in Gotham City.",
  },
  {
    id: "8",
    title: "A Court of Thorns and Roses",
    author: "Sarah J. Maas",
    image: "https://via.placeholder.com/150",
    description: "An inspiring story about resilience and courage.",
    chapters: ["Chapter One: The Challenge", "Chapter Two: Rising Up"],
    reviews: [
      { user: "Quinn", comment: "So uplifting!", rating: 5 },
      { user: "Rita", comment: "Motivational!", rating: 4 },
    ],
    rating: 4.9,
    category: "Fantasy Romance",
    storyOverview:
      "A retelling of Beauty and the Beast, blending fantasy and romance.",
  },
  {
    id: "9",
    title: "Counting Miracles: A Novel",
    author: "Nicholas Sparks",
    image: "https://via.placeholder.com/150",
    description: "A journey through time and space.",
    chapters: ["Chapter One: Time Travel", "Chapter Two: The Future"],
    reviews: [
      { user: "Sam", comment: "Fascinating concepts!", rating: 5 },
      { user: "Tina", comment: "A bit complicated.", rating: 3 },
    ],
    rating: 4.2,
    category: "Science Fiction",
    storyOverview:
      "A thought-provoking tale that explores the possibilities of time travel.",
  },
  {
    id: "10",
    title: "A Court of Mist and Fury",
    author: "Sarah J. Maas",
    image: "https://via.placeholder.com/150",
    description: "A comedic take on everyday life.",
    chapters: ["Chapter One: The Humor", "Chapter Two: Laughs"],
    reviews: [
      { user: "Ursula", comment: "Hilarious!", rating: 5 },
      { user: "Victor", comment: "Had me laughing out loud.", rating: 5 },
      { user: "Wendy", comment: "Some jokes fell flat.", rating: 2 },
    ],
    rating: 4.7,
    category: "Humor",
    storyOverview:
      "A light-hearted story that reflects the humorous side of daily life.",
  },
];

export default mockBooks;
