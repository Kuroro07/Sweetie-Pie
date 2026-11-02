import {
  Personalization,
  LoveReason,
  OpenWhenLetter,
  LoveVoucher,
  BucketListItem,
  MemoryStar,
  PageInfo,
  PhotoMemory
} from '../types';

export const PAGES: PageInfo[] = [
  { id: 'envelope', title: 'A Note to My Best Friend', shortTitle: 'The Letter', chapterNumber: 1, subtitle: 'A quiet letter written for Sweetie Pie' },
  { id: 'photos', title: 'Pictures of You (Scrapbook)', shortTitle: 'Her Photos', chapterNumber: 2, subtitle: 'Polaroids of my favorite person' },
  { id: 'reasons', title: 'Little Things I Notice About You', shortTitle: 'Reasons Jar', chapterNumber: 3, subtitle: 'Folded paper stars and things you probably didn’t know I notice' },
  { id: 'constellation', title: 'Map of Our Story', shortTitle: 'Memory Map', chapterNumber: 4, subtitle: 'The moments that made us inseparable' },
  { id: 'open-when', title: 'Open When... Letters', shortTitle: 'Care Letters', chapterNumber: 5, subtitle: 'For when you feel down or need reassurance' },
  { id: 'vouchers', title: 'Best Friend Vouchers', shortTitle: 'Vouchers', chapterNumber: 6, subtitle: 'Cozy favors you can cash in anytime' },
  { id: 'bucket-list', title: 'Things We Have to Do Together', shortTitle: 'Bucket List', chapterNumber: 7, subtitle: 'Adventures on our radar' },
  { id: 'final-note', title: 'A Promise to My Best Friend', shortTitle: 'Final Note', chapterNumber: 8, subtitle: 'Why having you in my life means everything' },
];

export const DEFAULT_PHOTOS: PhotoMemory[] = [];

export const DEFAULT_PERSONALIZATION: Personalization = {
  herName: 'Sweetie Pie',
  hisName: 'Your Best Friend',
  petName: 'Sweetie Pie',
  friendshipDate: '2023-09-15',
  envelopeMessage: `You know me better than almost anyone else in this world. We’ve spent hours laughing over silly inside jokes, talking through bad days, and sharing the quiet everyday moments.

You're easily one of the most important people in my life. I put together this quiet, unhurried space just for you—with your pictures, our favorite memories, and a few things I don't usually say out loud. 

Take your time, Sweetie Pie. There's no rush.`,
  secretScratchMessage: 'Out of 8 billion people, there is nobody I would rather spend a random Tuesday with. Whoever ends up with your heart is going to be the luckiest person in this world.',
  finalLetter: `Dear Sweetie Pie,

Being your best friend is hands down one of the greatest things in my life. I love our late-night conversations, the comfortable silences in the car, and how you can make me laugh even on days when I don't feel like smiling.

Sometimes people look for a rare kind of friendship their entire lives, and somehow I got lucky enough to find you. You're the first person I want to tell good news to, and the only person who can calm me down when my head is spinning.

I don't say it enough, but you are genuinely irreplaceable to me. No matter where life takes us, or what changes down the road, you will always have someone in your corner who thinks the absolute world of you.

Thanks for being you, Sweetie Pie.`,
  photos: DEFAULT_PHOTOS,
};

export const DEFAULT_REASONS: LoveReason[] = [
  { id: 'r1', category: 'best-friend', text: 'You can read my mood without me having to explain a single thing.' },
  { id: 'r2', category: 'little-things', text: 'The way your eyes crinkle up when you laugh at something genuinely hilarious.' },
  { id: 'r3', category: 'moments', text: 'When you text me a random meme or thought right in the middle of a busy workday.' },
  { id: 'r4', category: 'favorite-habits', text: 'How you get so excited over small treats and good food arriving at the table.' },
  { id: 'r5', category: 'best-friend', text: 'We have our own unspoken shorthand that nobody else in the room ever catches on to.' },
  { id: 'r6', category: 'little-things', text: 'How you laugh at your own stories before you even reach the punchline.' },
  { id: 'r7', category: 'moments', text: 'That quiet evening in the car when the music was low and neither of us wanted to get out.' },
  { id: 'r8', category: 'favorite-habits', text: 'The gentle, patient way you listen when I am overwhelmed or tired.' },
  { id: 'r9', category: 'best-friend', text: 'You celebrate my little wins as if they were your own.' },
  { id: 'r10', category: 'little-things', text: 'The funny little faces you make when you are concentrating or debating what to order.' },
  { id: 'r11', category: 'moments', text: 'When you fell asleep on my shoulder during the movie and I didn’t dare move an inch.' },
  { id: 'r12', category: 'favorite-habits', text: 'How effortlessly comfortable it feels to just sit in the same room with you doing nothing.' },
  { id: 'r13', category: 'best-friend', text: 'You never judge me for my quirks, insecurities, or terrible jokes.' },
  { id: 'r14', category: 'little-things', text: 'How pretty you look when your hair is messy and you are wearing an oversized hoodie.' },
  { id: 'r15', category: 'moments', text: 'The day we sat in comfortable silence for an hour, just existing together in peace.' },
  { id: 'r16', category: 'favorite-habits', text: 'Whoever ends up holding your hand for real one day is going to be the luckiest guy alive.' },
];

export const DEFAULT_LETTERS: OpenWhenLetter[] = [
  {
    id: 'doubting',
    title: 'Open when you are doubting yourself',
    subtitle: 'When your inner critic is speaking too loudly',
    stamp: 'Gentle Reminder',
    content: [
      'Take a slow breath. Put down whatever is weighing on your mind for just two minutes.',
      'You are one of the most capable, thoughtful, and resilient people I know. Sometimes you give so much grace to everyone else that you forget to save some for yourself.',
      'Whatever you are facing right now—you have the strength to handle it. You have navigated so much and come out with that same warm heart.',
      'I believe in you completely, even on the days when you forget how remarkable you are.'
    ],
    actionPrompt: 'Take a deep breath with me',
    actionType: 'deep-breath',
    closing: 'Your permanent cheerleader,'
  },
  {
    id: 'rough-day',
    title: 'Open when you’ve had an exhausting day',
    subtitle: 'When the world took too much out of you',
    stamp: 'Comfort & Warmth',
    content: [
      'Whatever happened today, it’s behind you now. You don’t have to prove anything tonight.',
      'Kick your shoes off, wrap yourself up in your softest blanket, and drink some water or hot tea.',
      'You don’t have to reply to texts, make decisions, or be "on". Just rest.',
      'If you want to talk about it, I’m here. If you want to sit in silence and say nothing, I’m here for that too.'
    ],
    actionPrompt: 'Virtual warm hug for Sweetie Pie',
    actionType: 'hug',
    closing: 'Always a safe harbor for you,'
  },
  {
    id: 'lonely',
    title: 'Open when you feel a little lonely',
    subtitle: 'For quiet nights when the room feels empty',
    stamp: 'Never Alone',
    content: [
      'Even when we are in different places, you are never truly alone.',
      'You occupy so much space in my daily thoughts. I think of your jokes, your smile, and the things you’d say about whatever I’m watching.',
      'Distance doesn’t change how close we are in spirit.',
      'Text or call me anytime—even if it’s just to say nothing. I am always on your team.'
    ],
    actionPrompt: 'Hold for an embrace',
    actionType: 'hug',
    closing: 'Right here by your side,'
  },
  {
    id: 'truth',
    title: 'Open when you wonder what I really think of you',
    subtitle: 'An honest look through my eyes',
    stamp: 'Through My Eyes',
    content: [
      'If you could see yourself through my eyes for just ten seconds, you would never doubt yourself again.',
      'I see someone who brings light into every room she walks into. Someone who is effortlessly funny, deeply empathetic, and breathtakingly pretty.',
      'You don’t need to try to impress anyone. Just being Sweetie Pie is more than enough.',
      'You are easily my favorite person to be around.'
    ],
    closing: 'Always admiring you,',
  }
];

export const DEFAULT_VOUCHERS: LoveVoucher[] = [
  {
    id: 'v1',
    title: '1x Free Venting Session with Iced Coffee On Me',
    description: 'You get to vent about work, life, or annoying people for an hour with zero unsolicited advice, plus your favorite drink.',
    category: 'friendship',
    isRedeemed: false,
  },
  {
    id: 'v2',
    title: '1x Late Night Car Ride & Playlist Takeover',
    description: 'Windows down, cool air, and you have 100% control of the aux cord. No skips or complaints.',
    category: 'cozy',
    isRedeemed: false,
  },
  {
    id: 'v3',
    title: '1x I Cook Your Favorite Comfort Food',
    description: 'Whatever meal you are craving, I’ll cook it and do all the dishes while you relax on the couch.',
    category: 'sweet',
    isRedeemed: false,
  },
  {
    id: 'v4',
    title: '1x Movie Night Where You Pick (Even Cheesy Ones)',
    description: 'Your choice of rom-com, thriller, or drama. Unlimited snacks and warm blankets included.',
    category: 'cozy',
    isRedeemed: false,
  },
  {
    id: 'v5',
    title: '1x Fancy Dinner Where We Dress Up (My Treat)',
    description: 'A nice evening out at a restaurant you’ve been dying to try, dressed up and having fun, on me.',
    category: 'adventure',
    isRedeemed: false,
  },
  {
    id: 'v6',
    title: 'The "You Win Any Trivial Debate" Pass',
    description: 'Play this coupon during any silly debate and I instantly concede defeat without another word.',
    category: 'friendship',
    isRedeemed: false,
  }
];

export const DEFAULT_BUCKET_LIST: BucketListItem[] = [
  { id: 'b1', title: 'Go to that quiet hillside spot we keep talking about and watch the sunset', category: 'adventure', completed: false },
  { id: 'b2', title: 'Spend an entire rainy Sunday baking something delicious together', category: 'cozy', completed: true, notes: 'Made a total mess but loved every minute' },
  { id: 'b3', title: 'Take a spontaneous road trip with no destination in mind', category: 'travel', completed: false },
  { id: 'b4', title: 'Go to a cozy bookstore and pick out books for each other to read', category: 'cozy', completed: false },
  { id: 'b5', title: 'Find the best late-night diner in town and try everything on the dessert menu', category: 'cozy', completed: false },
  { id: 'b6', title: 'Take a real proper photo of the two of us and frame it for the desk', category: 'cozy', completed: false },
  { id: 'b7', title: 'Learn to cook a fancy recipe from scratch together', category: 'adventure', completed: false },
  { id: 'b8', title: 'Stay up until 5 AM on a rooftop just talking with no phones', category: 'dream', completed: false },
];

export const DEFAULT_STARS: MemoryStar[] = [
  {
    id: 's1',
    title: 'The Day We First Talked',
    dateStr: 'When It All Started',
    location: 'Where We Met',
    story: 'I had no idea back then that the girl sitting across from me would become the most important person in my daily life. Best thing that ever happened to me.',
    xPercent: 22,
    yPercent: 40,
  },
  {
    id: 's2',
    title: 'The 3 AM Phone Call',
    dateStr: 'Late Night Talk',
    location: 'Under the Blankets',
    story: 'We were supposed to sleep at midnight, but we talked about our childhoods, our weird habits, and our dreams until the sky started turning blue.',
    xPercent: 50,
    yPercent: 65,
  },
  {
    id: 's3',
    title: 'When You Were There For Me',
    dateStr: 'A Tough Week',
    location: 'My Living Room',
    story: 'I was going through a stressful time, and you showed up with my favorite snack just to sit with me so I wouldn’t feel alone. I will never forget that.',
    xPercent: 76,
    yPercent: 35,
  }
];
