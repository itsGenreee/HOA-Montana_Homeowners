import { useReservation } from "@/contexts/ReservationContext";
import { useReservationService } from "@/services/ReservationService";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { ActivityIndicator, Button, Card, Divider, RadioButton, Text, TextInput } from "react-native-paper";

export default function Amenity() {
  const router = useRouter();
  const { 
    setEventType, setGuestCount,
    setChairQuantity, setChairPrice,
    setTableQuantity, setTablePrice,
    setVideoke, setVideokePrice,
    setProjector, setProjectorPrice,
    setBridesRoom, setBridesRoomPrice,
    setIslandGarden, setIslandGardenPrice
  } = useReservation();
  
  const { getAmenities } = useReservationService();

  const [loading, setLoading] = useState(true);
  const [eventType, setLocalEventType] = useState<string>("Wedding");
  const [customEvent, setCustomEvent] = useState<string>("");
  const [guestCount, setLocalGuestCount] = useState<string>("");
  const [amenities, setAmenityOptions] = useState<any[]>([]);
  const [quantities, setQuantities] = useState<{ [id: number]: number }>({});


  useEffect(() => {
    const fetchAmenities = async () => {
      try {
        const data = await getAmenities();
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
    const quantity = parseInt(value, 10) || 0;
    setQuantities(prev => ({ ...prev, [id]: quantity }));
  };

  const toggleAmenity = (amenity: any) => {
    if (amenity.max_quantity === 1) {
      const newQuantity = quantities[amenity.id] === 1 ? 0 : 1;
      setQuantities(prev => ({ ...prev, [amenity.id]: newQuantity }));
    }
  };

  const handleNext = () => {
    setEventType(eventType === "Others" ? customEvent : eventType);
    // Save guest count as number (default 0 if empty)
    setGuestCount(parseInt(guestCount, 10) || 0);
    // Update context with quantities and prices for UI display
    amenities.forEach(amenity => {
      const quantity = quantities[amenity.id] || 0;
      
      switch(amenity.id) {
        case 1: // Chair
          setChairQuantity(quantity);
          setChairPrice(amenity.price);
          break;
        case 2: // Table
          setTableQuantity(quantity);
          setTablePrice(amenity.price);
          break;
        case 3: // Videoke
          setVideoke(quantity);
          setVideokePrice(amenity.price);
          break;
        case 4: // Projector Set
          setProjector(quantity);
          setProjectorPrice(amenity.price);
          break;
        case 5: // Brides Room
          setBridesRoom(quantity);
          setBridesRoomPrice(amenity.price);
          break;
        case 6: // Island Garden
          setIslandGarden(quantity);
          setIslandGardenPrice(amenity.price);
          break;
      }
    });

    router.replace("./date");
  };

  const calculateAmenityTotal = (amenity: any) => {
    const quantity = quantities[amenity.id] || 0;
    return quantity * amenity.price;
  };

  const calculateTotal = () => {
    return amenities.reduce((total, amenity) => {
      return total + calculateAmenityTotal(amenity);
    }, 0);
  };

  const hasSelection = Object.values(quantities).some(qty => qty > 0);

  // Get selected amenities with quantities > 0
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

                {/* 1. EVENT TYPE SELECTION */}
        <Card style={styles.headerCard}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.title}>
              Event Type
            </Text>
            <RadioButton.Group
              onValueChange={(value) => setLocalEventType(value)}
              value={eventType}
            >
              {["Wedding", "Birthday", "Baptismal", "Others"].map(type => (
                <View key={type} style={styles.radioRow}>
                  <RadioButton value={type} />
                  <Text>{type}</Text>
                </View>
              ))}
            </RadioButton.Group>

            {eventType === "Others" && (
              <TextInput
                mode="outlined"
                label="Enter custom event"
                value={customEvent}
                onChangeText={setCustomEvent}
                style={{ marginTop: 8 }}
              />
            )}
          </Card.Content>
        </Card>

        {/* 2. GUEST COUNT */}
        <Card style={styles.headerCard}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.title}>
              Guest Count
            </Text>
            <TextInput
              mode="outlined"
              label="Number of Guests"
              keyboardType="numeric"
              value={guestCount}
              onChangeText={setLocalGuestCount}
              style={{ marginTop: 8 }}
            />
          </Card.Content>
        </Card>

        <Card style={styles.headerCard}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.title}>
              Select Amenities
            </Text>
            <Text variant="bodyMedium" style={styles.subtitle}>
              Choose the amenities you need for your event
            </Text>
          </Card.Content>
        </Card>

        {amenities.map((amenity) => (
          <Card key={amenity.id} style={styles.amenityCard}>
            <Card.Content>
              <View style={styles.amenityHeader}>
                <View style={styles.amenityInfo}>
                  <Text variant="titleMedium">{amenity.name}</Text>
                  <Text variant="bodyMedium" style={styles.priceText}>
                    ₱{amenity.price.toLocaleString()} {amenity.max_quantity === 1 ? '' : 'each'}
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
                    <Text variant="bodyMedium">Quantity:</Text>
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
                    <Text variant="bodyMedium">Item Total:</Text>
                    <Text variant="bodyMedium" style={styles.amenityTotalText}>
                      {quantities[amenity.id]} × ₱{amenity.price.toLocaleString()} = ₱{calculateAmenityTotal(amenity).toLocaleString()}
                    </Text>
                  </View>
                </>
              )}
            </Card.Content>
          </Card>
        ))}

        {hasSelection && (
          <Card style={styles.totalCard}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.breakdownTitle}>
                Amenities Breakdown:
              </Text>
              
              {selectedAmenities.map((amenity) => (
                <View key={amenity.id} style={styles.breakdownRow}>
                  <Text variant="bodyMedium">
                    {amenity.name} ×{quantities[amenity.id]}
                  </Text>
                  <Text variant="bodyMedium">
                    ₱{calculateAmenityTotal(amenity).toLocaleString()}
                  </Text>
                </View>
              ))}
              
              <Divider style={styles.breakdownDivider} />
              
              <View style={styles.finalTotalRow}>
                <Text variant="titleMedium">Estimated Amenities Total:</Text>
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
            disabled={!hasSelection}
            style={styles.nextButton}
            contentStyle={styles.buttonContent}
          >
            Continue to Date Selection
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  },
    radioRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  headerCard: {
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  title: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  subtitle: {
    textAlign: 'center',
    color: '#666',
    marginTop: 4,
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
  priceText: {
    color: '#2e7d32',
    fontWeight: '600',
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
  },
  amenityTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    padding: 4,
  },
  amenityTotalText: {
    color: '#2e7d32',
    fontWeight: '600',
  },
  totalCard: {
    marginTop: 16,
    backgroundColor: '#e8f5e8',
    padding: 8,
  },
  breakdownTitle: {
    fontWeight: 'bold',
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
  totalAmount: {
    color: '#155724',
    fontWeight: 'bold',
  },
  noteText: {
    color: '#666',
    fontStyle: 'italic',
    marginTop: 8,
    textAlign: 'center',
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
});