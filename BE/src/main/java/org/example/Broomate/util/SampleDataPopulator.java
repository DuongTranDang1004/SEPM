package org.example.Broomate.util;

import com.google.cloud.firestore.Firestore;
import lombok.RequiredArgsConstructor;
import org.example.Broomate.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.*;
import java.util.concurrent.ExecutionException;
@RequiredArgsConstructor
@Component
public class SampleDataPopulator {

    @Autowired
    private final Firestore firestore;

    private final Random random = new Random();
    
    // Sample data arrays for variety
    private final String[] names = {
        "Nguyen Van An", "Tran Thi Binh", "Le Van Cuong", "Pham Thi Dung", "Hoang Van Em",
        "Vu Thi Phuong", "Dang Van Giang", "Bui Thi Hoa", "Do Van Inh", "Ngo Thi Kim",
        "Lai Van Long", "Mai Thi My", "Phan Van Nam", "Truong Thi Oanh", "Vo Van Phuc",
        "Dinh Thi Quynh", "Cao Van Son", "Le Thi Thanh", "Nguyen Van Uy", "Tran Thi Vy"
    };
    
    private final String[] emails = {
        "an.nguyen@email.com", "binh.tran@email.com", "cuong.le@email.com", "dung.pham@email.com", "em.hoang@email.com",
        "phuong.vu@email.com", "giang.dang@email.com", "hoa.bui@email.com", "inh.do@email.com", "kim.ngo@email.com",
        "long.lai@email.com", "my.mai@email.com", "nam.phan@email.com", "oanh.truong@email.com", "phuc.vo@email.com",
        "quynh.dinh@email.com", "son.cao@email.com", "thanh.le@email.com", "uy.nguyen@email.com", "vy.tran@email.com"
    };
    
    private final String[] districts = {
        "District 1", "District 2", "District 3", "District 4", "District 5",
        "District 6", "District 7", "District 8", "District 9", "District 10",
        "District 11", "District 12", "Binh Thanh", "Tan Binh", "Phu Nhuan",
        "Thu Duc", "Go Vap", "Binh Tan", "Hoc Mon", "Cu Chi"
    };
    
    private final String[] occupations = {
        "Software Engineer", "Marketing Manager", "Graphic Designer", "Teacher", "Doctor",
        "Lawyer", "Accountant", "Sales Representative", "Student", "Freelancer",
        "Business Analyst", "Project Manager", "Content Creator", "Consultant", "Researcher"
    };
    
    private final String[] hobbies = {
        "Reading", "Gaming", "Cooking", "Photography", "Traveling", "Music", "Sports", "Art", "Dancing", "Gardening"
    };
    
    private final String[] lifestyles = {"Quiet", "Social", "Party"};
    private final String[] genders = {"Male", "Female", "Other"};
    
    private final String[] roomTitles = {
        "Cozy Studio in District 1", "Modern Apartment with City View", "Spacious Room Near University",
        "Luxury Condo with Pool", "Budget-Friendly Shared Room", "Furnished Room with Balcony",
        "Quiet Room in Residential Area", "Room Near Metro Station", "Newly Renovated Studio",
        "Room with Garden View", "High-Rise Apartment", "Traditional House Room",
        "Room with Private Bathroom", "Shared Apartment with Friends", "Room Near Shopping Mall",
        "Studio with Kitchen", "Room with Air Conditioning", "Pet-Friendly Room",
        "Room with Parking Space", "Room with WiFi Included"
    };
    
    private final String[] amenities = {
        "WiFi", "Air Conditioning", "Parking", "Gym", "Pool", "Balcony", "Kitchen", "Washing Machine",
        "Refrigerator", "TV", "Security", "Elevator", "Garden", "Terrace", "Storage"
    };
    
    private final String[] businessNames = {
        "Saigon Properties", "Ho Chi Minh Realty", "Vietnam Housing Co.", "City Living Solutions",
        "Metro Properties", "Urban Living Group", "District Real Estate", "Modern Housing Ltd.",
        "Premium Properties", "Affordable Housing Co.", "Luxury Living Group", "Student Housing Co.",
        "Family Properties", "Business District Realty", "Green Living Properties", "Metro Housing Co.",
        "Urban Solutions", "City Center Properties", "Modern Living Group", "Premium Housing Co."
    };

    public boolean isDatabaseEmpty() {
        try {
            // Check if any collections have documents
            return firestore.collection("tenants").limit(1).get().get().isEmpty() &&
                   firestore.collection("landlords").limit(1).get().get().isEmpty() &&
                   firestore.collection("rooms").limit(1).get().get().isEmpty();
        } catch (InterruptedException | ExecutionException e) {
            System.err.println("Error checking database: " + e.getMessage());
            return false;
        }
    }

    public void populateSampleData() {
        System.out.println("🌱 Starting to populate sample data...");
        
        try {
            // Create tenants first
            List<Tenant> tenants = createTenants();
            saveTenants(tenants);
            
            // Create landlords
            List<Landlord> landlords = createLandlords();
            saveLandlords(landlords);
            
            // Create rooms (linked to landlords)
            List<Room> rooms = createRooms(landlords);
            saveRooms(rooms);
            
            // Create swipes between tenants
            List<Swipe> swipes = createSwipes(tenants);
            saveSwipes(swipes);
            
            // Create matches based on mutual swipes
            List<Match> matches = createMatchesFromSwipes(swipes, tenants);
            
            // Create conversations for matches
            List<Conversation> conversations = createConversationsForMatches(matches);
            saveConversations(conversations);
            
            // Update matches with conversation IDs and save
            updateMatchesWithConversationIds(matches, conversations);
            saveMatches(matches);
            
            // Create messages in conversations
            List<Message> messages = createMessages(conversations, tenants);
            saveMessages(messages);
            
            // Create bookmarks (tenants bookmarking rooms)
            List<Bookmark> bookmarks = createBookmarks(tenants, rooms);
            saveBookmarks(bookmarks);
            
            System.out.println("✅ Sample data populated successfully!");
            System.out.println("📊 Created:");
            System.out.println("   • 20 Tenants");
            System.out.println("   • 20 Landlords");
            System.out.println("   • 20 Rooms");
            System.out.println("   • 50 Swipes");
            System.out.println("   • " + matches.size() + " Matches");
            System.out.println("   • " + conversations.size() + " Conversations");
            System.out.println("   • " + messages.size() + " Messages");
            System.out.println("   • " + bookmarks.size() + " Bookmarks");
            
        } catch (Exception e) {
            System.err.println("❌ Error populating sample data: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private List<Tenant> createTenants() {
        List<Tenant> tenants = new ArrayList<>();
        
        for (int i = 0; i < 20; i++) {
            Tenant tenant = new Tenant();
            tenant.setEmail(emails[i]);
            tenant.setPassword("$2a$10$dummyHash" + i); // Dummy hashed password
            tenant.setName(names[i]);
            tenant.setPhone("090" + String.format("%08d", random.nextInt(100000000)));
            tenant.setAvatarUrl("https://api.dicebear.com/7.x/avataaars/svg?seed=" + names[i].replace(" ", ""));
            tenant.setDescription("Looking for a comfortable place to live in " + districts[random.nextInt(districts.length)]);
            
            // Tenant-specific fields
            tenant.setBudgetPerMonth(3000000.0 + random.nextDouble() * 15000000.0); // 3M - 18M VND
            tenant.setStayLengthMonths(6 + random.nextInt(18)); // 6-24 months
            // Set move-in date as ISO string for Firebase compatibility
            LocalDate moveInDate = LocalDate.now().plusDays(random.nextInt(90));
            tenant.setMoveInDate(moveInDate.toString());
            tenant.setPreferredDistricts(Arrays.asList(
                districts[random.nextInt(districts.length)],
                districts[random.nextInt(districts.length)]
            ));
            

            tenants.add(tenant);
        }
        
        return tenants;
    }

    private List<Landlord> createLandlords() {
        List<Landlord> landlords = new ArrayList<>();
        
        for (int i = 0; i < 20; i++) {
            Landlord landlord = new Landlord();
            landlord.setEmail("landlord" + i + "@property.com");
            landlord.setPassword("$2a$10$dummyHash" + i);
            landlord.setName("Landlord " + names[i]);
            landlord.setPhone("091" + String.format("%08d", random.nextInt(100000000)));
            landlord.setAvatarUrl("https://api.dicebear.com/7.x/avataaars/svg?seed=landlord" + i);
            landlord.setDescription("Professional property manager with " + (5 + random.nextInt(15)) + " years experience");
            

            
            landlords.add(landlord);
        }
        
        return landlords;
    }

    private List<Room> createRooms(List<Landlord> landlords) {
        List<Room> rooms = new ArrayList<>();
        
        for (int i = 0; i < 20; i++) {
            Room room = new Room();
            room.setLandlordId(landlords.get(i).getId());
            room.setTitle(roomTitles[i]);
            room.setDescription("Beautiful " + (room.getTitle().toLowerCase()) + " in " + districts[random.nextInt(districts.length)] + 
                              ". Perfect for " + (random.nextBoolean() ? "students" : "professionals") + ".");
            room.setThumbnailUrl("https://picsum.photos/400/300?random=" + i);
            
            // Generate image URLs
            List<String> imageUrls = new ArrayList<>();
            for (int j = 0; j < 3 + random.nextInt(5); j++) {
                imageUrls.add("https://picsum.photos/800/600?random=" + (i * 10 + j));
            }
            room.setImageUrls(imageUrls);
            
            // Pricing and terms
            room.setRentPricePerMonth(2000000.0 + random.nextDouble() * 20000000.0); // 2M - 22M VND
            room.setMinimumStayMonths(3 + random.nextInt(12)); // 3-15 months

            // Location
            room.setAddress(districts[random.nextInt(districts.length)] + ", Ho Chi Minh City");
            room.setLatitude(10.762622 + (random.nextDouble() - 0.5) * 0.1);
            room.setLongitude(106.660172 + (random.nextDouble() - 0.5) * 0.1);
            
            // Room details


            // Status
            Room.RoomStatus[] statuses = Room.RoomStatus.values();
            room.setStatus(statuses[random.nextInt(statuses.length)]);
            
            rooms.add(room);
        }
        
        return rooms;
    }

    private List<Conversation> createConversationsForMatches(List<Match> matches) {
        List<Conversation> conversations = new ArrayList<>();
        
        // Create conversations for each match
        for (Match match : matches) {
            Conversation conversation = new Conversation();
            
            conversation.setParticipantIds(Arrays.asList(
                match.getTenant1Id(),
                match.getTenant2Id()
            ));
            
            conversation.setLastMessage("Hello! Nice to meet you!");

            
            conversations.add(conversation);
            
            // Set the conversation ID in the match
            // Note: This will be set after the conversation is saved to Firebase
        }
        
        return conversations;
    }

    private List<Message> createMessages(List<Conversation> conversations, List<Tenant> tenants) {
        List<Message> messages = new ArrayList<>();
        
        for (Conversation conversation : conversations) {
            // Create 2-5 messages per conversation
            int messageCount = 2 + random.nextInt(4);
            
            for (int i = 0; i < messageCount; i++) {
                Message message = new Message();
                message.setConversationId(conversation.getId());
                
                // Alternate between participants
                String senderId = conversation.getParticipantIds().get(i % 2);
                message.setSenderId(senderId);
                
                // Find sender name
                String senderName = tenants.stream()
                    .filter(t -> t.getId().equals(senderId))
                    .findFirst()
                    .map(Tenant::getName)
                    .orElse("Unknown");

                String[] sampleMessages = {
                    "Hello! Nice to meet you!",
                    "How are you doing?",
                    "I'm looking for a roommate too!",
                    "What's your budget range?",
                    "I prefer quiet places",
                    "Do you have any pets?",
                    "I'm a student at RMIT",
                    "I work in District 1",
                    "Let's meet up sometime!",
                    "Sounds good to me!"
                };
                
                message.setContent(sampleMessages[random.nextInt(sampleMessages.length)]);

                
                messages.add(message);
            }
        }
        
        return messages;
    }

    private List<Swipe> createSwipes(List<Tenant> tenants) {
        List<Swipe> swipes = new ArrayList<>();
        Set<String> swipePairs = new HashSet<>();
        
        // Create 50 swipes between different tenant pairs
        for (int i = 0; i < 50; i++) {
            Swipe swipe = new Swipe();
            
            // Select two different tenants
            int swiperIndex = random.nextInt(tenants.size());
            int targetIndex = random.nextInt(tenants.size());
            while (targetIndex == swiperIndex) {
                targetIndex = random.nextInt(tenants.size());
            }
            
            String swiperId = tenants.get(swiperIndex).getId();
            String targetId = tenants.get(targetIndex).getId();
            
            // Avoid duplicate swipes
            String swipeKey = swiperId + "_" + targetId;
            if (swipePairs.contains(swipeKey)) {
                continue;
            }
            swipePairs.add(swipeKey);
            
            swipe.setSwiperId(swiperId);
            swipe.setTargetId(targetId);
            
            // 60% accept, 40% reject (more realistic)
            swipe.setAction(random.nextDouble() < 0.6 ? Swipe.SwipeActionEnum.ACCEPT : Swipe.SwipeActionEnum.REJECT);
            
            swipes.add(swipe);
        }
        
        return swipes;
    }

    private List<Match> createMatchesFromSwipes(List<Swipe> swipes, List<Tenant> tenants) {
        List<Match> matches = new ArrayList<>();
        Map<String, Swipe> swipeMap = new HashMap<>();
        
        // Create a map of swipes for quick lookup
        for (Swipe swipe : swipes) {
            String key = swipe.getSwiperId() + "_" + swipe.getTargetId();
            swipeMap.put(key, swipe);
        }
        
        // Find mutual swipes (both tenants swiped ACCEPT on each other)
        for (Swipe swipe : swipes) {
            if (swipe.getAction() == Swipe.SwipeActionEnum.ACCEPT) {
                String reverseKey = swipe.getTargetId() + "_" + swipe.getSwiperId();
                Swipe reverseSwipe = swipeMap.get(reverseKey);
                
                if (reverseSwipe != null && reverseSwipe.getAction() == Swipe.SwipeActionEnum.ACCEPT) {
                    // Both swiped ACCEPT - create a match
                    Match match = new Match();
                    match.setTenant1Id(swipe.getSwiperId());
                    match.setTenant2Id(swipe.getTargetId());
                    match.setStatus(Match.MatchStatusEnum.ACTIVE);
                    
                    matches.add(match);
                    
                    // Remove from map to avoid duplicate matches
                    swipeMap.remove(swipe.getSwiperId() + "_" + swipe.getTargetId());
                    swipeMap.remove(reverseKey);
                }
            }
        }
        
        return matches;
    }

    private List<Bookmark> createBookmarks(List<Tenant> tenants, List<Room> rooms) {
        List<Bookmark> bookmarks = new ArrayList<>();
        Set<String> bookmarkPairs = new HashSet<>();
        
        // Create 30 bookmarks (tenants bookmarking rooms)
        for (int i = 0; i < 30; i++) {
            Bookmark bookmark = new Bookmark();
            
            String tenantId = tenants.get(random.nextInt(tenants.size())).getId();
            String roomId = rooms.get(random.nextInt(rooms.size())).getId();
            
            // Avoid duplicate bookmarks
            String bookmarkKey = tenantId + "_" + roomId;
            if (bookmarkPairs.contains(bookmarkKey)) {
                continue;
            }
            bookmarkPairs.add(bookmarkKey);
            
            bookmark.setTenantId(tenantId);
            bookmark.setRoomId(roomId);
            bookmarks.add(bookmark);
        }
        
        return bookmarks;
    }

    private void updateMatchesWithConversationIds(List<Match> matches, List<Conversation> conversations) {
        // Link matches to their corresponding conversations
        for (int i = 0; i < Math.min(matches.size(), conversations.size()); i++) {
            Match match = matches.get(i);
            Conversation conversation = conversations.get(i);
            match.setConversationId(conversation.getId());
        }
    }

    // Save methods
    private void saveTenants(List<Tenant> tenants) throws ExecutionException, InterruptedException {
        for (Tenant tenant : tenants) {
            firestore.collection("tenants").add(tenant).get();
        }
    }

    private void saveLandlords(List<Landlord> landlords) throws ExecutionException, InterruptedException {
        for (Landlord landlord : landlords) {
            firestore.collection("landlords").add(landlord).get();
        }
    }

    private void saveRooms(List<Room> rooms) throws ExecutionException, InterruptedException {
        for (Room room : rooms) {
            firestore.collection("rooms").add(room).get();
        }
    }

    private void saveConversations(List<Conversation> conversations) throws ExecutionException, InterruptedException {
        for (Conversation conversation : conversations) {
            firestore.collection("conversations").add(conversation).get();
        }
    }

    private void saveMessages(List<Message> messages) throws ExecutionException, InterruptedException {
        for (Message message : messages) {
            firestore.collection("messages").add(message).get();
        }
    }

    private void saveSwipes(List<Swipe> swipes) throws ExecutionException, InterruptedException {
        for (Swipe swipe : swipes) {
            firestore.collection("swipes").add(swipe).get();
        }
    }

    private void saveMatches(List<Match> matches) throws ExecutionException, InterruptedException {
        for (Match match : matches) {
            firestore.collection("matches").add(match).get();
        }
    }

    private void saveBookmarks(List<Bookmark> bookmarks) throws ExecutionException, InterruptedException {
        for (Bookmark bookmark : bookmarks) {
            firestore.collection("bookmarks").add(bookmark).get();
        }
    }
}
