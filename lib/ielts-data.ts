export interface WritingPrompt {
  id: string;
  task: 1 | 2;
  prompt: string;
  minWords: number;
}

export type SpeakingTheme =
  | "place"
  | "person"
  | "object"
  | "event"
  | "experience"
  | "skill"
  | "activity"
  | "media"
  | "food"
  | "goal";

export interface SpeakingCueCard {
  id: string;
  topic: string;
  bulletPoints: string[];
  theme: SpeakingTheme;
}

export interface SpeakingPart1TopicSet {
  id: string;
  topic: string;
  questions: string[];
}

export const writingPrompts: WritingPrompt[] = [
  {
    id: "t1-1",
    task: 1,
    prompt:
      "The graph below shows the average monthly temperatures in three cities over one year. Summarise the information by selecting and reporting the main features.",
    minWords: 150,
  },
  {
    id: "t1-2",
    task: 1,
    prompt:
      "The pie charts below show the percentage of household income spent on different categories in 2000 and 2020. Summarise the information and make comparisons.",
    minWords: 150,
  },
  {
    id: "t1-3",
    task: 1,
    prompt:
      "The bar chart below shows the number of international students enrolled in undergraduate and postgraduate programmes at a UK university between 2005 and 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    minWords: 150,
  },
  {
    id: "t1-4",
    task: 1,
    prompt:
      "The line graph below illustrates the total amount of electricity generated from renewable sources in four European countries between 2000 and 2022. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    minWords: 150,
  },
  {
    id: "t1-5",
    task: 1,
    prompt:
      "The table below provides information about the percentage of households with access to the internet in five different countries in 2005, 2012, and 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    minWords: 150,
  },
  {
    id: "t1-6",
    task: 1,
    prompt:
      "The diagram below shows the process by which recycled paper is produced from waste paper collected from households and offices. Summarise the information by selecting and reporting the main features.",
    minWords: 150,
  },
  {
    id: "t1-7",
    task: 1,
    prompt:
      "The two maps below show the layout of a coastal town in 1990 and in 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    minWords: 150,
  },
  {
    id: "t1-8",
    task: 1,
    prompt:
      "The bar chart below shows the proportion of male and female workers employed in six different sectors of the economy in one country in 2021. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    minWords: 150,
  },
  {
    id: "t1-9",
    task: 1,
    prompt:
      "The line graph below shows the average daily consumption of bottled water per person in four countries between 2000 and 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    minWords: 150,
  },
  {
    id: "t1-10",
    task: 1,
    prompt:
      "The diagram below illustrates the life cycle of the salmon, from egg to adult fish. Summarise the information by selecting and reporting the main features.",
    minWords: 150,
  },
  {
    id: "t1-11",
    task: 1,
    prompt:
      "The table below gives information about the number of tourists visiting five major cities in Asia in 2010 and 2020, along with the average length of stay. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    minWords: 150,
  },
  {
    id: "t1-12",
    task: 1,
    prompt:
      "The bar chart below shows the amount of money spent on five different leisure activities by men and women in one country in 2019. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    minWords: 150,
  },
  {
    id: "t1-13",
    task: 1,
    prompt:
      "The line graph below shows the birth rates in Japan, Germany, and Brazil from 1970 to 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    minWords: 150,
  },
  {
    id: "t1-14",
    task: 1,
    prompt:
      "The diagram below shows how solar panels are used to generate electricity for a typical household. Summarise the information by selecting and reporting the main features.",
    minWords: 150,
  },
  {
    id: "t1-15",
    task: 1,
    prompt:
      "The two pie charts below compare the sources of energy used in one country in 1990 and in 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    minWords: 150,
  },
  {
    id: "t1-16",
    task: 1,
    prompt:
      "The bar chart below shows the percentage of adults in a European country who participated in various forms of physical exercise in 2000, 2010, and 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    minWords: 150,
  },
  {
    id: "t1-17",
    task: 1,
    prompt:
      "The maps below show a university campus as it was in 1985 and as it is planned to look in 2030. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    minWords: 150,
  },
  {
    id: "t2-1",
    task: 2,
    prompt:
      "Some people think that universities should focus on preparing students for employment. Others believe the purpose of university is broader than this. Discuss both views and give your own opinion.",
    minWords: 250,
  },
  {
    id: "t2-2",
    task: 2,
    prompt:
      "In many countries, the gap between the rich and the poor is increasing. What are the causes of this? What measures could be taken to reduce it?",
    minWords: 250,
  },
  {
    id: "t2-3",
    task: 2,
    prompt:
      "Technology has made it easier for people to work from home. What are the advantages and disadvantages of this trend?",
    minWords: 250,
  },
  {
    id: "t2-4",
    task: 2,
    prompt:
      "Some people believe that children should be taught how to manage money at primary school, while others think this is a subject better learned at home. Discuss both views and give your own opinion.",
    minWords: 250,
  },
  {
    id: "t2-5",
    task: 2,
    prompt:
      "In many countries today, people rely heavily on private cars as their main form of transport. What problems does this cause, and what measures could be taken to address them?",
    minWords: 250,
  },
  {
    id: "t2-6",
    task: 2,
    prompt:
      "Some people think that governments should invest more money in public libraries, while others argue that these funds would be better spent on digital services. Discuss both views and give your own opinion.",
    minWords: 250,
  },
  {
    id: "t2-7",
    task: 2,
    prompt:
      "The widespread use of social media has changed the way people communicate with one another. To what extent do you agree or disagree that this change has had a positive effect on society?",
    minWords: 250,
  },
  {
    id: "t2-8",
    task: 2,
    prompt:
      "In some countries, an increasing number of people are choosing to live alone rather than with family or partners. Why is this happening, and what effects does it have on society?",
    minWords: 250,
  },
  {
    id: "t2-9",
    task: 2,
    prompt:
      "Many young people today leave their hometowns to study or work in larger cities. What are the advantages and disadvantages of this trend?",
    minWords: 250,
  },
  {
    id: "t2-10",
    task: 2,
    prompt:
      "Some people believe that the best way to reduce crime is to give longer prison sentences, while others think there are more effective alternatives. Discuss both views and give your own opinion.",
    minWords: 250,
  },
  {
    id: "t2-11",
    task: 2,
    prompt:
      "In many countries, traditional festivals and customs are disappearing as a result of globalisation. What are the causes of this trend, and what can be done to preserve cultural traditions?",
    minWords: 250,
  },
  {
    id: "t2-12",
    task: 2,
    prompt:
      "Some people think that scientific research should be carried out and funded by governments, while others believe it is better left to private companies. Discuss both views and give your own opinion.",
    minWords: 250,
  },
  {
    id: "t2-13",
    task: 2,
    prompt:
      "It is often said that tourism brings economic benefits but damages the environment and local cultures. To what extent do you agree or disagree?",
    minWords: 250,
  },
  {
    id: "t2-14",
    task: 2,
    prompt:
      "In many countries, obesity rates among children are rising rapidly. What are the main causes of this problem, and what measures can be taken to tackle it?",
    minWords: 250,
  },
  {
    id: "t2-15",
    task: 2,
    prompt:
      "Some people believe that the news media has too much influence on public opinion in modern society. To what extent do you agree or disagree?",
    minWords: 250,
  },
  {
    id: "t2-16",
    task: 2,
    prompt:
      "More and more people are working past the traditional retirement age. What are the advantages and disadvantages of this development?",
    minWords: 250,
  },
  {
    id: "t2-17",
    task: 2,
    prompt:
      "Some people think that children should begin learning a foreign language at primary school, while others believe it is better to start in secondary school. Discuss both views and give your own opinion.",
    minWords: 250,
  },
  {
    id: "t2-18",
    task: 2,
    prompt:
      "In many large cities around the world, there is a shortage of affordable housing. What are the reasons for this, and what can governments do to solve the problem?",
    minWords: 250,
  },
  {
    id: "t2-19",
    task: 2,
    prompt:
      "Some people believe that zoos are cruel and should be closed down, while others argue that they play an important role in protecting endangered species. Discuss both views and give your own opinion.",
    minWords: 250,
  },
  {
    id: "t2-20",
    task: 2,
    prompt:
      "The use of artificial intelligence in the workplace is increasing rapidly. Do the advantages of this development outweigh the disadvantages?",
    minWords: 250,
  },
  {
    id: "t2-21",
    task: 2,
    prompt:
      "In some countries, governments are encouraging industries and businesses to move to rural areas rather than remain in city centres. Do the benefits of this policy outweigh the drawbacks?",
    minWords: 250,
  },
  {
    id: "t2-22",
    task: 2,
    prompt:
      "Many people today spend a significant amount of their free time looking at screens. Why is this the case, and what effects does it have on physical and mental health?",
    minWords: 250,
  },
  {
    id: "t2-23",
    task: 2,
    prompt:
      "Some people argue that the government should provide free healthcare to all citizens, while others believe individuals should be responsible for their own medical expenses. Discuss both views and give your own opinion.",
    minWords: 250,
  },
  {
    id: "t2-24",
    task: 2,
    prompt:
      "In many parts of the world, fewer people are reading books for pleasure. What are the reasons for this trend, and what can be done to encourage reading?",
    minWords: 250,
  },
  {
    id: "t2-25",
    task: 2,
    prompt:
      "Some people believe that space exploration is a waste of money and resources, while others argue that it is essential for the future of humanity. Discuss both views and give your own opinion.",
    minWords: 250,
  },
  {
    id: "t2-26",
    task: 2,
    prompt:
      "In many countries, people are choosing to have children later in life. What are the reasons for this, and what effects does it have on families and society?",
    minWords: 250,
  },
  {
    id: "t2-27",
    task: 2,
    prompt:
      "Advertising has become a powerful force in modern life, influencing what people buy and how they behave. To what extent do you agree or disagree that advertising has a harmful effect on society?",
    minWords: 250,
  },
  {
    id: "t2-28",
    task: 2,
    prompt:
      "Some people think that international sporting events help to promote peace and understanding between countries, while others believe they create tension and rivalry. Discuss both views and give your own opinion.",
    minWords: 250,
  },
];

export const speakingCueCards: SpeakingCueCard[] = [
  {
    id: "s1",
    topic: "Describe a place you have visited that you found very interesting.",
    bulletPoints: [
      "Where it is",
      "When you went there",
      "What you did there",
      "Explain why you found it interesting",
    ],
    theme: "place",
  },
  {
    id: "s2",
    topic: "Describe a person who has had a great influence on your life.",
    bulletPoints: [
      "Who this person is",
      "How long you have known them",
      "What qualities they have",
      "Explain how they have influenced you",
    ],
    theme: "person",
  },
  {
    id: "s3",
    topic: "Describe a skill you would like to learn.",
    bulletPoints: [
      "What the skill is",
      "Why you want to learn it",
      "How you would learn it",
      "Explain how it would be useful to you",
    ],
    theme: "skill",
  },
  {
    id: "s4",
    topic: "Describe a book that you have recently read and enjoyed.",
    bulletPoints: [
      "What the book was about",
      "When and where you read it",
      "Who recommended it to you, or how you came across it",
      "Explain why you enjoyed reading this book",
    ],
    theme: "media",
  },
  {
    id: "s5",
    topic: "Describe a piece of technology that you find useful in your daily life.",
    bulletPoints: [
      "What it is",
      "How often you use it",
      "What you use it for",
      "Explain why you find it so useful",
    ],
    theme: "object",
  },
  {
    id: "s6",
    topic: "Describe a time when you had to wake up very early in the morning.",
    bulletPoints: [
      "When it was",
      "Why you had to wake up early",
      "What you did that day",
      "Explain how you felt about waking up so early",
    ],
    theme: "event",
  },
  {
    id: "s7",
    topic: "Describe an event from your childhood that you remember well.",
    bulletPoints: [
      "When it happened",
      "Where it took place",
      "Who was with you",
      "Explain why you still remember this event",
    ],
    theme: "event",
  },
  {
    id: "s8",
    topic: "Describe a healthy habit that you have.",
    bulletPoints: [
      "What the habit is",
      "When you started doing it",
      "How often you do it",
      "Explain why this habit is important to you",
    ],
    theme: "goal",
  },
  {
    id: "s9",
    topic: "Describe a goal that you hope to achieve in the future.",
    bulletPoints: [
      "What the goal is",
      "When you started thinking about it",
      "What you are doing to achieve it",
      "Explain why this goal is important to you",
    ],
    theme: "goal",
  },
  {
    id: "s10",
    topic: "Describe a restaurant that you enjoy going to.",
    bulletPoints: [
      "Where it is",
      "What kind of food it serves",
      "How often you go there",
      "Explain why you enjoy eating at this restaurant",
    ],
    theme: "place",
  },
  {
    id: "s11",
    topic: "Describe a teacher who has influenced you.",
    bulletPoints: [
      "Who the teacher was",
      "What subject they taught",
      "When you were taught by them",
      "Explain how this teacher influenced you",
    ],
    theme: "person",
  },
  {
    id: "s12",
    topic: "Describe a piece of clothing that you often wear.",
    bulletPoints: [
      "What it is",
      "Where you got it from",
      "When you usually wear it",
      "Explain why you like wearing this item of clothing",
    ],
    theme: "object",
  },
  {
    id: "s13",
    topic: "Describe a foreign country you would like to visit.",
    bulletPoints: [
      "Which country it is",
      "How you first heard about it",
      "What you would like to do there",
      "Explain why you want to visit this country",
    ],
    theme: "place",
  },
  {
    id: "s14",
    topic: "Describe a time when you helped someone.",
    bulletPoints: [
      "Who you helped",
      "When it was",
      "What you did to help them",
      "Explain how you felt about helping this person",
    ],
    theme: "experience",
  },
  {
    id: "s15",
    topic: "Describe a hobby that you enjoy doing in your free time.",
    bulletPoints: [
      "What the hobby is",
      "When you started doing it",
      "How often you do it",
      "Explain why you enjoy this hobby",
    ],
    theme: "activity",
  },
  {
    id: "s16",
    topic: "Describe a family member you are close to.",
    bulletPoints: [
      "Who the person is",
      "What they are like",
      "What you usually do together",
      "Explain why you are close to this family member",
    ],
    theme: "person",
  },
  {
    id: "s17",
    topic: "Describe a gift that you gave to someone.",
    bulletPoints: [
      "What the gift was",
      "Who you gave it to",
      "Why you chose that gift",
      "Explain how the person reacted when they received it",
    ],
    theme: "event",
  },
  {
    id: "s18",
    topic: "Describe a song or piece of music that you like.",
    bulletPoints: [
      "What the song is",
      "When you first heard it",
      "How often you listen to it",
      "Explain why you like this song",
    ],
    theme: "media",
  },
  {
    id: "s19",
    topic: "Describe a time when you were very busy.",
    bulletPoints: [
      "When it was",
      "Why you were so busy",
      "What you had to do",
      "Explain how you managed your time during this period",
    ],
    theme: "experience",
  },
  {
    id: "s20",
    topic: "Describe a park or garden that you like to visit.",
    bulletPoints: [
      "Where it is",
      "What it looks like",
      "What you usually do there",
      "Explain why you enjoy visiting this place",
    ],
    theme: "place",
  },
  {
    id: "s21",
    topic: "Describe a sport that you enjoy watching or playing.",
    bulletPoints: [
      "What the sport is",
      "When you first became interested in it",
      "Where you watch or play it",
      "Explain why you enjoy this sport",
    ],
    theme: "activity",
  },
  {
    id: "s22",
    topic: "Describe a challenging decision that you had to make.",
    bulletPoints: [
      "What the decision was about",
      "When you had to make it",
      "What options you considered",
      "Explain why this decision was difficult for you",
    ],
    theme: "experience",
  },
  {
    id: "s23",
    topic: "Describe a traditional food from your country.",
    bulletPoints: [
      "What the food is",
      "What ingredients are used to make it",
      "When people usually eat it",
      "Explain why this food is important in your culture",
    ],
    theme: "food",
  },
  {
    id: "s24",
    topic: "Describe a website that you often visit.",
    bulletPoints: [
      "What the website is",
      "How you discovered it",
      "What kind of information it provides",
      "Explain why you visit this website so often",
    ],
    theme: "object",
  },
  {
    id: "s25",
    topic: "Describe a time when you received good news.",
    bulletPoints: [
      "What the news was",
      "When you received it",
      "Who told you the news",
      "Explain how you felt when you heard it",
    ],
    theme: "event",
  },
  {
    id: "s26",
    topic: "Describe a long journey that you remember well.",
    bulletPoints: [
      "Where you went",
      "How you travelled",
      "Who you were with",
      "Explain why you remember this journey so well",
    ],
    theme: "place",
  },
  {
    id: "s27",
    topic: "Describe a small business that you would like to start.",
    bulletPoints: [
      "What kind of business it would be",
      "Where you would open it",
      "Who would be your customers",
      "Explain why you would like to start this type of business",
    ],
    theme: "goal",
  },
  {
    id: "s28",
    topic: "Describe a photograph that is important to you.",
    bulletPoints: [
      "What is in the photograph",
      "When it was taken",
      "Who took it",
      "Explain why this photograph is important to you",
    ],
    theme: "object",
  },
  {
    id: "s29",
    topic: "Describe a public building that you find interesting.",
    bulletPoints: [
      "Where it is located",
      "What it looks like",
      "What it is used for",
      "Explain why you find this building interesting",
    ],
    theme: "place",
  },
  {
    id: "s30",
    topic: "Describe an occasion when you tried something for the first time.",
    bulletPoints: [
      "What you tried",
      "When and where it was",
      "Who you were with",
      "Explain how you felt about trying it",
    ],
    theme: "experience",
  },
  {
    id: "s31",
    topic: "Describe an interesting conversation you had with a stranger.",
    bulletPoints: [
      "Where you were",
      "Who the person was",
      "What you talked about",
      "Explain why you found the conversation interesting",
    ],
    theme: "person",
  },
  {
    id: "s32",
    topic: "Describe an activity that you enjoy doing outdoors.",
    bulletPoints: [
      "What the activity is",
      "Where you usually do it",
      "Who you do it with",
      "Explain why you enjoy doing this activity outdoors",
    ],
    theme: "activity",
  },
  {
    id: "s33",
    topic: "Describe a language, other than English, that you would like to learn.",
    bulletPoints: [
      "Which language it is",
      "Where this language is spoken",
      "How you would learn it",
      "Explain why you would like to learn this language",
    ],
    theme: "skill",
  },
];

export const speakingPart1Topics: SpeakingPart1TopicSet[] = [
  {
    id: "p1-hometown",
    topic: "Hometown",
    questions: [
      "Where is your hometown?",
      "What do you like most about your hometown?",
      "Has your hometown changed much in recent years?",
      "Would you recommend it as a place to visit? Why?",
    ],
  },
  {
    id: "p1-work-study",
    topic: "Work or study",
    questions: [
      "Do you work or are you a student?",
      "What do you enjoy most about it?",
      "What is a typical day like for you?",
      "What are your plans for the future?",
    ],
  },
  {
    id: "p1-hobbies",
    topic: "Hobbies & free time",
    questions: [
      "What do you like to do in your free time?",
      "How did you become interested in this?",
      "Do you prefer doing hobbies alone or with others?",
      "Would you like to try any new hobbies?",
    ],
  },
  {
    id: "p1-food",
    topic: "Food",
    questions: [
      "What kind of food do you usually eat?",
      "Do you prefer cooking at home or eating out?",
      "Is there a traditional dish you especially enjoy?",
      "Have your eating habits changed since you were a child?",
    ],
  },
  {
    id: "p1-weather",
    topic: "Weather",
    questions: [
      "What kind of weather do you like?",
      "What is the weather usually like in your country?",
      "Does the weather affect your mood?",
      "Would you prefer to live somewhere with a different climate?",
    ],
  },
  {
    id: "p1-technology",
    topic: "Technology",
    questions: [
      "How often do you use a smartphone?",
      "What apps do you use most?",
      "Has technology made your life easier or harder?",
      "Do you think people rely too much on technology?",
    ],
  },
  {
    id: "p1-travel",
    topic: "Travel",
    questions: [
      "Do you enjoy travelling?",
      "Where was the last place you travelled to?",
      "Do you prefer travelling alone or with others?",
      "Is there somewhere you would really like to visit?",
    ],
  },
  {
    id: "p1-music",
    topic: "Music",
    questions: [
      "What kind of music do you listen to?",
      "When do you usually listen to music?",
      "Have your music tastes changed over the years?",
      "Do you play any musical instruments?",
    ],
  },
  {
    id: "p1-reading",
    topic: "Reading",
    questions: [
      "Do you enjoy reading?",
      "What kind of books do you like?",
      "Do you prefer paper books or ebooks?",
      "How important do you think reading is for children?",
    ],
  },
  {
    id: "p1-clothes",
    topic: "Clothes",
    questions: [
      "What kind of clothes do you usually wear?",
      "Do you enjoy shopping for clothes?",
      "How important is fashion to you?",
      "Do people in your country dress differently on special occasions?",
    ],
  },
  {
    id: "p1-weekend",
    topic: "Weekends",
    questions: [
      "What do you usually do at weekends?",
      "Do you prefer a quiet weekend or a busy one?",
      "Is your weekend different from your weekdays?",
      "Would you like to change how you spend your weekends?",
    ],
  },
  {
    id: "p1-sleep",
    topic: "Sleep",
    questions: [
      "How many hours of sleep do you usually get?",
      "Do you take naps during the day?",
      "What do you do if you can't sleep?",
      "Do you think sleep is important for health?",
    ],
  },
];

export const speakingPart3Questions: Record<SpeakingTheme, string[]> = {
  place: [
    "Why do people enjoy visiting new places?",
    "How has tourism changed in your country in recent decades?",
    "What are the downsides of popular places becoming too crowded?",
    "Do you think people appreciate their own country less than foreign destinations?",
    "How can cities be made more attractive for both residents and visitors?",
  ],
  person: [
    "What qualities make someone a positive influence on others?",
    "Do you think role models are more or less important today than in the past?",
    "How does family influence a person's development compared with friends?",
    "Can someone famous still be a good role model if they make mistakes publicly?",
    "Is it better to have one strong mentor or many casual influences?",
  ],
  object: [
    "How have everyday objects changed in the last twenty years?",
    "Do people form genuine emotional attachments to objects?",
    "Is it better to own many things or live more simply?",
    "How is technology changing what we consider 'essential' possessions?",
    "Why do some old-fashioned objects remain popular despite newer alternatives?",
  ],
  event: [
    "Why do certain events stay in our memory for a long time?",
    "How important are public celebrations in bringing a community together?",
    "Do you think traditional events are losing their meaning?",
    "How has social media changed the way people experience events?",
    "Are private family events more meaningful than large public ones?",
  ],
  experience: [
    "Do difficult experiences teach us more than easy ones?",
    "How does a person's age affect what they learn from an experience?",
    "Is it better to try many different things or focus deeply on one area?",
    "How important is it to step outside your comfort zone?",
    "Can other people's experiences be as valuable as our own?",
  ],
  skill: [
    "Are practical skills more useful than academic knowledge in today's world?",
    "Who should be responsible for teaching children life skills — schools or parents?",
    "Is it easier or harder to learn new skills as we get older?",
    "How has the internet changed the way people learn skills?",
    "Are there any skills that will always be relevant regardless of technological change?",
  ],
  activity: [
    "Why do people need leisure activities in modern life?",
    "Are group activities more beneficial than solo ones?",
    "How has the way people spend their free time changed over the years?",
    "Should governments do more to encourage people to be active?",
    "Do children today have enough opportunities to be physically active?",
  ],
  media: [
    "How has the way people consume media changed in the past decade?",
    "Do you think traditional media (books, newspapers) still have a role today?",
    "Is it a problem that people spend so much time on screens?",
    "How does media influence public opinion?",
    "Should media content for young people be more tightly regulated?",
  ],
  food: [
    "How important is traditional food to a country's identity?",
    "Are fast-food chains damaging local food cultures?",
    "Do you think people eat more healthily today than in the past?",
    "Should schools teach cooking as a core subject?",
    "How does the way families share meals affect relationships?",
  ],
  goal: [
    "Why is it important for people to have long-term goals?",
    "Are short-term goals or long-term goals more motivating?",
    "How do cultural expectations shape the goals young people set?",
    "Is it a problem if someone changes their goals often?",
    "Should schools spend more time helping students set personal goals?",
  ],
};

export function getRandomWritingPrompt(task?: 1 | 2): WritingPrompt {
  const filtered = task
    ? writingPrompts.filter((p) => p.task === task)
    : writingPrompts;
  return filtered[Math.floor(Math.random() * filtered.length)];
}

export function getRandomCueCard(): SpeakingCueCard {
  return speakingCueCards[
    Math.floor(Math.random() * speakingCueCards.length)
  ];
}

export function getRandomCueCardByTheme(theme: SpeakingTheme): SpeakingCueCard {
  const filtered = speakingCueCards.filter((c) => c.theme === theme);
  return filtered[Math.floor(Math.random() * filtered.length)];
}

export function getRandomPart1Topics(n = 3): SpeakingPart1TopicSet[] {
  const shuffled = [...speakingPart1Topics].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

export function getPart3QuestionsForTheme(theme: SpeakingTheme): string[] {
  return speakingPart3Questions[theme];
}
