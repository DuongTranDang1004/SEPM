import React from 'react';
import Button from '../common/Button';
import Badge from '../common/Badge';
import './RoomCard.css';

function RoomCard({ 
  roomData, 
  isBookmarked, 
  onToggleBookmark, 
  onClickCard 
}) {
  const {
    budgetPerMonth,
    preferredDistricts = [],
    needWindow = false,
    mightShareBedRoom = false,
    mightShareToilet = false,
    photoUrl = 'default-room.jpg'
  } = roomData;
  
  const locationDisplay = preferredDistricts.length > 0
    ? preferredDistricts.join(", ")
    : "Various Districts";
    
  const priceDisplay = typeof budgetPerMonth === 'number'
    ? `$${budgetPerMonth.toLocaleString()}/month`
    : "Price N/A";
  
  const featureBadges = [];
  
  if (needWindow) {
    featureBadges.push(
      <Badge 
        key="window"
        text="Window Req." 
        variant="success" 
        iconName="window" 
      />
    );
  }
  
  if (mightShareBedRoom) {
    featureBadges.push(
      <Badge 
        key="bedroom"
        text="Share Room OK" 
        variant="info" 
        iconName="users" 
      />
    );
  }
  
  if (mightShareToilet) {
    featureBadges.push(
      <Badge 
        key="toilet"
        text="Share Bath OK" 
        variant="info" 
        iconName="toilet" 
      />
    );
  }
  
  return (
    <div 
      className="listing-card-root"
      onClick={onClickCard}
      style={{ cursor: "pointer" }}
    >
      <div 
        className="card-photo-area"
        style={{ backgroundImage: `url('${photoUrl}')` }}
      >
        <div className="bookmark-button-wrapper">
          <Button
            variant="ghost"
            iconName="bookmark"
            isIconOnly={true}
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onToggleBookmark();
            }}
          />
        </div>
      </div>
      
      <div className="card-info-area">
        <h3 className="card-price">{priceDisplay}</h3>
        <p className="card-location">{locationDisplay}</p>
        <div className="card-badges-container">
          {featureBadges}
        </div>
      </div>
    </div>
  );
}

export default RoomCard;