import { useReservation } from "@/contexts/ReservationContext";
import { useReservationService } from "@/services/ReservationService";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Platform, ScrollView, StatusBar, StyleSheet, View } from "react-native";
import { ActivityIndicator, Button, Card, Divider, RadioButton, Text, TextInput } from "react-native-paper";

export default function Amenity() {
  const router = useRouter();
  const { 
    setEventType, setGuestCount,
    setChairQuantity, setChairPrice,
    setVideoke, setVideokePrice,
    setProjector, setProjectorPrice,
    setBridesRoom, setBridesRoomPrice,
    setIslandGarden, setIslandGardenPrice
  } = useReservation();
  
  const { getAmenities } = useReservationService();

  const [loading, setLoading] = useState(true);
  const [eventType, setLocalEventType] = useState<string>("");
  const [customEvent, setCustomEvent] = useState<string>("");
  const [guestCount, setLocalGuestCount] = useState<string>("");
  const [amenities, setAmenityOptions] = useState<any[]>([]);
  const [quantities, setQuantities] = useState<{ [id: number]: number }>({});

  // Validation states
  const [eventTypeError, setEventTypeError] = useState<string>("");
  const [guestCountError, setGuestCountError] = useState<string>("");

  useEffect(() => {
    const fetchAmenities = async () => {
      try {
        const data = await getAmenities();
        console.log('Fetched amenities:', data);
        setAmenityOptions(data);
      } catch (error) {
        console.error("Failed to fetch amenities:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAmenities();
  }, [getAmenities]);

  const handleQuantityChange = (id: number, value: string) => {
    // Remove non-numeric characters (same as before)
    const numericValue = value.replace(/[^0-9]/g, '');
    
    if (numericValue === '') {
      setQuantities(prev => ({ ...prev, [id]: 0 }));
      return;
    }

    const quantity = parseInt(numericValue, 10);
    const amenity = amenities.find(a => a.id === id);
    
    if (amenity && quantity <= amenity.max_quantity) {
      setQuantities(prev => ({ ...prev, [id]: quantity }));
    } else if (amenity && quantity > amenity.max_quantity) {
      setQuantities(prev => ({ ...prev, [id]: amenity.max_quantity }));
    }
  };

  // New: Guest Count validation similar to chair quantity
  const handleGuestCountChange = (value: string) => {
    // Remove non-numeric characters (same logic as handleQuantityChange)
    const numericValue = value.replace(/[^0-9]/g, '');
    
    if (numericValue === '') {
      setLocalGuestCount('');
      setGuestCountError('');
      return;
    }

    // Parse as integer
    const guestNumber = parseInt(numericValue, 10);
    
    // Set the numeric value (without any decimals, commas, or other characters)
    setLocalGuestCount(numericValue);
    
    // Clear error if valid number
    if (guestNumber > 0) {
      setGuestCountError('');
    }
  };

  const toggleAmenity = (amenity: any) => {
    if (amenity.max_quantity === 1) {
      const newQuantity = quantities[amenity.id] === 1 ? 0 : 1;
      setQuantities(prev => ({ ...prev, [amenity.id]: newQuantity }));
    }
  };

  const validateForm = (): boolean => {
    let isValid = true;

    // Validate Event Type
    if (!eventType) {
      setEventTypeError("Please select an event type");
      isValid = false;
    } else if (eventType === "Others" && !customEvent.trim()) {
      setEventTypeError("Please enter your event type");
      isValid = false;
    } else {
      setEventTypeError("");
    }

    // Validate Guest Count
    if (!guestCount.trim()) {
      setGuestCountError("Please enter number of guests");
      isValid = false;
    } else if (parseInt(guestCount, 10) <= 0) {
      setGuestCountError("Guest count must be greater than 0");
      isValid = false;
    } else {
      setGuestCountError("");
    }

    return isValid;
  };

  const handleNext = () => {
    if (!validateForm()) {
      return;
    }

    const finalEventType = eventType === "Others" ? customEvent : eventType;
    const finalGuestCount = parseInt(guestCount, 10) || 0;
    
    setEventType(finalEventType);
    setGuestCount(finalGuestCount);
    
    // Update context with quantities and prices for UI display
    amenities.forEach(amenity => {
      const quantity = quantities[amenity.id] || 0;
      
      switch(amenity.id) {
        case 1: // Chair
          setChairQuantity(quantity);
          setChairPrice(parseFloat(amenity.price));
          break;
        case 2: // Videoke
          setVideoke(quantity);
          setVideokePrice(parseFloat(amenity.price));
          break;
        case 3: // Projector Set
          setProjector(quantity);
          setProjectorPrice(parseFloat(amenity.price));
          break;
        case 4: // Brides Room
          setBridesRoom(quantity);
          setBridesRoomPrice(parseFloat(amenity.price));
          break;
        case 5: // Island Garden
          setIslandGarden(quantity);
          setIslandGardenPrice(parseFloat(amenity.price));
          break;
      }
    });

    router.replace("./date");
  };

  const calculateAmenityTotal = (amenity: any) => {
    const quantity = quantities[amenity.id] || 0;
    return quantity * parseFloat(amenity.price);
  };

  const calculateTotal = () => {
    return amenities.reduce((total, amenity) => {
      return total + calculateAmenityTotal(amenity);
    }, 0);
  };

  // Check if required fields are filled
  const isFormValid = () => {
    const hasValidEventType = eventType && (eventType !== "Others" || customEvent.trim());
    const hasValidGuestCount = guestCount.trim() && parseInt(guestCount, 10) > 0;
    return hasValidEventType && hasValidGuestCount;
  };

  const hasAmenitySelection = Object.values(quantities).some(qty => qty > 0);
  const selectedAmenities = amenities.filter(amenity => quantities[amenity.id] > 0);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading amenities...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* 1. EVENT TYPE SELECTION - REQUIRED */}
        <Card style={styles.headerCard}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.title}>
              Event Type *
            </Text>
            <Text variant="bodySmall" style={styles.requiredText}>
              Required field
            </Text>
            <RadioButton.Group
              onValueChange={(value) => {
                setLocalEventType(value);
                if (value && value !== "Others") {
                  setEventTypeError("");
                }
              }}
              value={eventType}
            >
              {["Wedding", "Birthday", "Baptismal", "Others"].map(type => (
                <View key={type} style={styles.radioRow}>
                  <RadioButton value={type} />
                  <Text style={styles.radioText}>{type}</Text>
                </View>
              ))}
            </RadioButton.Group>

            {eventType === "Others" && (
              <TextInput
                mode="outlined"
                label="Enter custom event *"
                value={customEvent}
                onChangeText={(text) => {
                  setCustomEvent(text);
                  if (text.trim()) {
                    setEventTypeError("");
                  }
                }}
                style={{ marginTop: 8 }}
                error={!!eventTypeError}
              />
            )}
            
            {eventTypeError ? (
              <Text style={styles.errorText}>{eventTypeError}</Text>
            ) : null}
          </Card.Content>
        </Card>

        {/* 2. GUEST COUNT - REQUIRED */}
        <Card style={styles.headerCard}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.title}>
              Guest Count *
            </Text>
            <Text variant="bodySmall" style={styles.requiredText}>
              Required field - Numbers only
            </Text>
            <TextInput
              mode="outlined"
              label="Number of Guests *"
              keyboardType="numeric"
              value={guestCount}
              onChangeText={handleGuestCountChange} // Use the new validation function
              style={{ marginTop: 8 }}
              error={!!guestCountError}
            />
          </Card.Content>
        </Card>

        <Card style={styles.headerCard}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.title}>
              Select Amenities
            </Text>
            <Text variant="bodyMedium" style={styles.subtitle}>
              Optional - Choose the amenities you need for your event
            </Text>
          </Card.Content>
        </Card>

        {amenities.map((amenity) => (
          <Card key={amenity.id} style={styles.amenityCard}>
            <Card.Content>
              <View style={styles.amenityHeader}>
                <View style={styles.amenityInfo}>
                  <Text variant="titleMedium" style={styles.amenityName}>
                    {amenity.name}
                  </Text>
                  <Text variant="bodyMedium" style={styles.priceText}>
                    ₱{parseFloat(amenity.price).toLocaleString()} {amenity.max_quantity === 1 ? '' : 'each'}
                  </Text>
                </View>
                {amenity.max_quantity === 1 && (
                  <Button
                    mode={quantities[amenity.id] === 1 ? "contained" : "outlined"}
                    onPress={() => toggleAmenity(amenity)}
                    style={styles.toggleButton}
                  >
                    {quantities[amenity.id] === 1 ? 'Selected' : 'Select'}
                  </Button>
                )}
              </View>

              {amenity.max_quantity > 1 && (
                <>
                  <Divider style={styles.divider} />
                  <View style={styles.quantitySection}>
                    <Text variant="bodyMedium" style={styles.quantityLabel}>Quantity:</Text>
                    <View style={styles.quantityControls}>
                      <TextInput
                        mode="outlined"
                        style={styles.quantityInput}
                        keyboardType="numeric"
                        value={quantities[amenity.id]?.toString() || ''}
                        onChangeText={(value) => handleQuantityChange(amenity.id, value)}
                        maxLength={amenity.max_quantity.toString().length}
                      />
                      <Text variant="bodySmall" style={styles.maxText}>
                        Max: {amenity.max_quantity}
                      </Text>
                    </View>
                  </View>
                </>
              )}

              {/* Show individual amenity total */}
              {quantities[amenity.id] > 0 && (
                <>
                  <Divider style={styles.divider} />
                  <View style={styles.amenityTotalRow}>
                    <Text variant="bodyMedium" style={styles.amenityTotalLabel}>Item Total:</Text>
                    <Text variant="bodyMedium" style={styles.amenityTotalText}>
                      {quantities[amenity.id]} × ₱{parseFloat(amenity.price).toLocaleString()} = ₱{calculateAmenityTotal(amenity).toLocaleString()}
                    </Text>
                  </View>
                </>
              )}
            </Card.Content>
          </Card>
        ))}

        {hasAmenitySelection && (
          <Card style={styles.totalCard}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.breakdownTitle}>
                Amenities Breakdown:
              </Text>
              
              {selectedAmenities.map((amenity) => (
                <View key={amenity.id} style={styles.breakdownRow}>
                  <Text variant="bodyMedium" style={styles.breakdownItem}>
                    {amenity.name} ×{quantities[amenity.id]}
                  </Text>
                  <Text variant="bodyMedium" style={styles.breakdownPrice}>
                    ₱{calculateAmenityTotal(amenity).toLocaleString()}
                  </Text>
                </View>
              ))}
              
              <Divider style={styles.breakdownDivider} />
              
              <View style={styles.finalTotalRow}>
                <Text variant="titleMedium" style={styles.finalTotalLabel}>
                  Amenities Total:
                </Text>
                <Text variant="headlineSmall" style={styles.totalAmount}>
                  ₱{calculateTotal().toLocaleString()}
                </Text>
              </View>
              
              <Text variant="bodySmall" style={styles.noteText}>
                *Final pricing will be confirmed by the server
              </Text>
            </Card.Content>
          </Card>
        )}
      </ScrollView>

      <Card style={styles.footerCard}>
        <Card.Content>
          <Button
            mode="contained"
            onPress={handleNext}
            disabled={!isFormValid()}
            style={styles.nextButton}
            contentStyle={styles.buttonContent}
          >
            Continue to Date Selection
          </Button>
          {!isFormValid() && (
            <Text style={styles.requiredHint}>
              * Please fill in all required fields to continue
            </Text>
          )}
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    paddingHorizontal: 20,
    paddingBottom: 20
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    marginTop: 16,
    fontFamily: 'Satoshi-Regular',
    fontWeight: '400',
  },
  radioRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  radioText: {
    fontFamily: 'Satoshi-Regular',
    fontWeight: '400',
  },
  headerCard: {
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  title: {
    textAlign: 'center',
    fontFamily: 'Satoshi-Bold',
    fontWeight: '400',
  },
  subtitle: {
    textAlign: 'center',
    color: '#666',
    marginTop: 4,
    fontFamily: 'Satoshi-Regular',
    fontWeight: '400',
  },
  requiredText: {
    textAlign: 'center',
    color: '#666',
    fontFamily: 'Satoshi-Regular',
    fontWeight: '400',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 12,
    fontFamily: 'Satoshi-Regular',
    fontWeight: '400',
    marginTop: 4,
    textAlign: 'center',
  },
  helperText: {
    color: '#666',
    fontSize: 12,
    fontFamily: 'Satoshi-Regular',
    fontWeight: '400',
    marginTop: 4,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  amenityCard: {
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  amenityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  amenityInfo: {
    flex: 1,
  },
  amenityName: {
    fontFamily: 'Satoshi-Medium',
    fontWeight: '400',
  },
  priceText: {
    color: '#2e7d32',
    fontFamily: 'Satoshi-Medium',
    fontWeight: '400',
  },
  toggleButton: {
    minWidth: 100,
  },
  divider: {
    marginVertical: 8,
  },
  quantitySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  quantityLabel: {
    fontFamily: 'Satoshi-Medium',
    fontWeight: '400',
  },
  quantityControls: {
    alignItems: 'center',
    gap: 4,
  },
  quantityInput: {
    width: 80,
    height: 40,
    textAlign: 'center',
  },
  maxText: {
    color: '#666',
    fontFamily: 'Satoshi-Regular',
    fontWeight: '400',
  },
  amenityTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    padding: 4,
  },
  amenityTotalLabel: {
    fontFamily: 'Satoshi-Medium',
    fontWeight: '400',
  },
  amenityTotalText: {
    color: '#2e7d32',
    fontFamily: 'Satoshi-Medium',
    fontWeight: '400',
  },
  totalCard: {
    marginTop: 16,
    backgroundColor: '#e8f5e8',
    padding: 8,
  },
  breakdownTitle: {
    fontFamily: 'Satoshi-Bold',
    fontWeight: '400',
    marginBottom: 12,
    textAlign: 'center',
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  breakdownItem: {
    fontFamily: 'Satoshi-Regular',
    fontWeight: '400',
  },
  breakdownPrice: {
    fontFamily: 'Satoshi-Medium',
    fontWeight: '400',
  },
  breakdownDivider: {
    marginVertical: 8,
  },
  finalTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    padding: 8,
    backgroundColor: '#d4edda',
    borderRadius: 6,
  },
  finalTotalLabel: {
    fontFamily: 'Satoshi-Medium',
    fontWeight: '400',
  },
  totalAmount: {
    color: '#155724',
    fontFamily: 'Satoshi-Bold',
    fontWeight: '400',
  },
  noteText: {
    color: '#666',
    fontStyle: 'italic',
    marginTop: 8,
    textAlign: 'center',
    fontFamily: 'Satoshi-Regular',
    fontWeight: '400',
  },
  footerCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  nextButton: {
    marginVertical: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  requiredHint: {
    textAlign: 'center',
    color: '#666',
    fontSize: 12,
    fontFamily: 'Satoshi-Regular',
    fontWeight: '400',
    marginTop: 4,
    fontStyle: 'italic',
  },
});