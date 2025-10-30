package org.example.Broomate.service;

import com.google.cloud.Timestamp;
import lombok.extern.slf4j.Slf4j;
import org.example.Broomate.dto.request.landlord.CreateRoomRequest;
import org.example.Broomate.dto.request.landlord.UpdateLandlordProfileRequest;
import org.example.Broomate.dto.request.landlord.UpdateRoomRequest;
import org.example.Broomate.dto.response.landlord.LandlordProfileResponse;
import org.example.Broomate.dto.response.allAuthUser.RoomDetailResponse;
import org.example.Broomate.model.Landlord;
import org.example.Broomate.model.Room;
import org.example.Broomate.repository.LandlordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

@Slf4j
@Service
public class LandlordService {

    @Autowired
    private LandlordRepository landlordRepository;

    // ========================================
    // CREATE ROOM
    // ========================================
    public RoomDetailResponse createRoom(String landlordId, CreateRoomRequest request) {

        log.info("Creating room for landlord: {}", landlordId);

        // 1. Verify landlord exists
        Landlord landlord = landlordRepository.findById(landlordId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Landlord not found with ID: " + landlordId
                ));

        // 2. Create new room
        Room room = Room.builder()
                .id(UUID.randomUUID().toString())
                .landlordId(landlordId)
                .title(request.getTitle())
                .description(request.getDescription())
                .thumbnailUrl(request.getThumbnailUrl())
                .imageUrls(request.getImageUrls())
                .videoUrls(request.getVideoUrls())
                .documentUrls(request.getDocumentUrls())
                .rentPricePerMonth(request.getRentPricePerMonth())
                .minimumStayMonths(request.getMinimumStayMonths())
                .address(request.getAddress())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .numberOfToilets(request.getNumberOfToilets())
                .status(Room.RoomStatus.PUBLISHED)  // Default to PUBLISHED
                .createdAt(Timestamp.now())
                .updatedAt(Timestamp.now())
                .build();

        // 3. Save to database
        Room savedRoom = landlordRepository.saveRoom(room);

        log.info("Room created successfully with ID: {}", savedRoom.getId());

        // 4. Convert to response
        return RoomDetailResponse.fromRoom(savedRoom);
    }

    // ========================================
    // UPDATE ROOM
    // ========================================
    public RoomDetailResponse updateRoom( String landlordId, String roomId, UpdateRoomRequest request) {
        log.info("Updating room {} for landlord {}", roomId, landlordId);

        // 1. Get existing room
        Room room = landlordRepository.findRoomById(roomId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Room not found with ID: " + roomId
                ));

        // 2. Verify ownership
        if (!room.getLandlordId().equals(landlordId)) {
            throw new AccessDeniedException("You don't have permission to update this room");
        }

        // 3. Update fields
        room.setTitle(request.getTitle());
        room.setDescription(request.getDescription());
        room.setThumbnailUrl(request.getThumbnailUrl());
        room.setImageUrls(request.getImageUrls());
        room.setVideoUrls(request.getVideoUrls());
        room.setDocumentUrls(request.getDocumentUrls());
        room.setRentPricePerMonth(request.getRentPricePerMonth());
        room.setMinimumStayMonths(request.getMinimumStayMonths());
        room.setAddress(request.getAddress());
        room.setLatitude(request.getLatitude());
        room.setLongitude(request.getLongitude());
        room.setNumberOfToilets(request.getNumberOfToilets());
        room.setStatus(request.getStatus());
        room.setUpdatedAt(Timestamp.now());

        // 4. Save updated room
        Room updatedRoom = landlordRepository.updateRoom(roomId, room);

        log.info("Room updated successfully: {}", roomId);

        // 5. Convert to response
        return RoomDetailResponse.fromRoom(updatedRoom);
    }

    // ========================================
    // UPDATE LANDLORD PROFILE
    // ========================================
    public LandlordProfileResponse updateProfile(String landlordId, UpdateLandlordProfileRequest request) {
        log.info("Updating landlord profile for ID: {}", landlordId);

        // 1. Get existing landlord
        Landlord landlord = landlordRepository.findById(landlordId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Landlord not found with ID: " + landlordId
                ));

        // 2. Update fields
        landlord.setName(request.getName());
        landlord.setPhone(request.getPhone());
        landlord.setAvatarUrl(request.getAvatarUrl());
        landlord.setDescription(request.getDescription());
        landlord.setUpdatedAt(Timestamp.now());

        // 3. Save updated landlord
        Landlord updatedLandlord = landlordRepository.update(landlordId, landlord);

        log.info("Landlord profile updated successfully: {}", landlordId);

        // 4. Convert to response
        return LandlordProfileResponse.fromLandlord(updatedLandlord);
    }

    // ========================================
    // GET LANDLORD PROFILE
    // ========================================
    public LandlordProfileResponse getProfile(String landlordId) {
        log.info("Getting landlord profile for ID: {}", landlordId);

        Landlord landlord = landlordRepository.findById(landlordId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Landlord not found with ID: " + landlordId
                ));

        return LandlordProfileResponse.fromLandlord(landlord);
    }
}