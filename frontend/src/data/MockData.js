export const mockMessages = [
    {
        id: 1,
        text: "Hi there! I saw your profile. Are you still looking for a room in District 1?",
        is_user_message: false,
        timestamp: "10:05 AM",
        avatar_url: 'partner_avatar.jpg'
    },
    {
        id: 2,
        text: "Yes, I am! My budget is around $1200. Is the room near the metro station?",
        is_user_message: true,
        timestamp: "10:06 AM",
        avatar_url: 'user_avatar.jpg'
    },
    {
        id: 3,
        text: "It's about a 5-minute walk. Do you smoke or have pets?",
        is_user_message: false,
        timestamp: "10:08 AM",
        avatar_url: 'partner_avatar.jpg'
    }
];

export const mockMatchCandidates = [
    {
        id: 101,
        name: "Jane Doe",
        age: 25,
        location: "District 2, Thao Dien",
        photoUrl: 'images/jane.jpg',
        bio: "Looking for a quiet, clean, and non-smoking roommate. I cook often!",
        preferences: ["Non-smoker", "Clean", "Loves Cooking"],
        compatibility: { score: "90%", reason: "Same budget, similar cooking habits, and both prefer quiet evenings." }
    },
];
