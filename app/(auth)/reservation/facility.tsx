import { useReservation } from "@/contexts/ReservationContext";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { Dimensions, FlatList, Image, Modal, StyleSheet, Text, View } from "react-native";
import { Button, Card, IconButton, TouchableRipple, useTheme } from "react-native-paper";

const { width: screenWidth } = Dimensions.get('window');

export default function Facility() {
  const router = useRouter();
  const { facility_id, setFacilityId } = useReservation();
  const [selected, setSelected] = useState<number | null>(facility_id);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const theme = useTheme();
  const flatListRef = useRef<FlatList>(null);

  // Map facilities by id with images and individual descriptions
  const options = [
    { 
      id: 1, 
      name: "Tennis Court",
      images: [
        {
          source: require('@/assets/images/tennis_court-facility1.png'),
          description: "Full-Size Tennis Court"
        },
        {
          source: require('@/assets/images/tennis_court-facility2.png'),
          description: "Court lighting system for evening matches"
        },
        {
          source: require('@/assets/images/tennis_court-facility3.png'),
          description: "Referee/Umpire Chair also included — great for tournaments"
        },
      ],
      generalDescription: "Full-Size Court for Tennis"
    },
    { 
      id: 2, 
      name: "Basketball Court",
      images: [
        {
          source: require('@/assets/images/basketball_court-facility2.png'),
          description: "Full-Size Multi-Purpose Court"
        },
        {
          source: require('@/assets/images/basketball_court-facility3.png'),
          description: "Spacious, can be setup for volleyball (Equipments not provided)"
        },
        {
          source: require('@/assets/images/basketball_court-facility4.png'),
          description: "Court lighting system for evening matches (Pa-ilaw)"
        },
      ],
      generalDescription: "Full-Size Multi-Purpose Court with Stage"
    },
    { 
      id: 3, 
      name: "Event Place",
      images: [
        {
          source: require('@/assets/images/event_place-facility1.png'),
          description: " Main Entrance to Event Place"
        },
        {
          source: require('@/assets/images/event_place-facility4.png'),
          description: "Main Event Hall"
        },
        {
          source: require('@/assets/images/event_place-facility6.png'),
          description: "Back-Stage Preparation Area"
        },
        {
          source: require('@/assets/images/event_place-facility7.png'),
          description: "Back-Stage Preparation Area"
        },
      ],
      generalDescription: "Spacious event venue perfect for various events"
    },
  ];

  const handleNext = () => {
    if (selected !== null) {
      setFacilityId(selected);

      if (selected === 3) {
        router.replace("./amenities");
      } else {
        router.replace("./date");
      }
    }
  };

  const handleFacilityPress = (facilityId: number) => {
    setSelected(facilityId);
    setCurrentImageIndex(0);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleNextImage = () => {
    const selectedFacility = options.find(option => option.id === selected);
    if (selectedFacility) {
      const newIndex = currentImageIndex === selectedFacility.images.length - 1 ? 0 : currentImageIndex + 1;
      setCurrentImageIndex(newIndex);
      
      // Scroll FlatList to the new index
      flatListRef.current?.scrollToIndex({
        index: newIndex,
        animated: true,
      });
    }
  };

  const handlePrevImage = () => {
    const selectedFacility = options.find(option => option.id === selected);
    if (selectedFacility) {
      const newIndex = currentImageIndex === 0 ? selectedFacility.images.length - 1 : currentImageIndex - 1;
      setCurrentImageIndex(newIndex);
      
      // Scroll FlatList to the new index
      flatListRef.current?.scrollToIndex({
        index: newIndex,
        animated: true,
      });
    }
  };

  const selectedFacility = options.find(option => option.id === selected);
  const currentImageDescription = selectedFacility?.images[currentImageIndex]?.description || "";

  return (
    <View style={styles.container}>
      <Text style={[styles.header, { color: theme.colors.onBackground }]}>
        Select a Facility
      </Text>
      
      <View style={styles.grid}>
        {options.map((option) => {
          const isSelected = selected === option.id;
          return (
            <Card
              key={option.id}
              style={[
                styles.card,
                isSelected && { backgroundColor: theme.colors.primary },
              ]}
            >
              <TouchableRipple
                onPress={() => handleFacilityPress(option.id)}
                rippleColor="rgba(0, 0, 0, 0.1)"
                borderless
                style={styles.touchable}
              >
                <View style={styles.cardContent}>
                  <Text
                    style={[
                      styles.cardText,
                      isSelected && { color: "#fff", fontWeight: "600" },
                    ]}
                  >
                    {option.name}
                  </Text>
                  <Text style={[styles.tapText, isSelected && { color: "#fff" }]}>
                    Tap to view images
                  </Text>
                </View>
              </TouchableRipple>
            </Card>
          );
        })}
      </View>

      {/* Image Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="formSheet"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <IconButton
              icon="close"
              size={24}
              onPress={handleCloseModal}
            />
            <Text style={[styles.modalTitle, { color: theme.colors.onBackground }]}>
              {selectedFacility?.name}
            </Text>
            <View style={{ width: 40 }} /> {/* Spacer for balance */}
          </View>

          {selectedFacility && (
            <View style={styles.modalContent}>
              {/* Image Carousel */}
              <View style={styles.carouselContainer}>
                <FlatList
                  ref={flatListRef}
                  data={selectedFacility.images}
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(_, index) => index.toString()}
                  onMomentumScrollEnd={(event) => {
                    const newIndex = Math.round(
                      event.nativeEvent.contentOffset.x / screenWidth
                    );
                    setCurrentImageIndex(newIndex);
                  }}
                  getItemLayout={(data, index) => ({
                    length: screenWidth,
                    offset: screenWidth * index,
                    index,
                  })}
                  initialScrollIndex={currentImageIndex}
                  renderItem={({ item }) => (
                    <View style={styles.imageContainer}>
                      <Image 
                        source={item.source} 
                        style={styles.image}
                        resizeMode="contain"
                      />
                    </View>
                  )}
                />
                
                {/* Navigation Arrows */}
                {selectedFacility.images.length > 1 && (
                  <View style={styles.navigationContainer}>
                    <IconButton
                      icon="chevron-left"
                      size={30}
                      mode="contained"
                      onPress={handlePrevImage}
                      style={styles.navButton}
                    />
                    <IconButton
                      icon="chevron-right"
                      size={30}
                      mode="contained"
                      onPress={handleNextImage}
                      style={styles.navButton}
                    />
                  </View>
                )}

                {/* Image Indicator */}
                {selectedFacility.images.length > 1 && (
                  <View style={styles.indicatorContainer}>
                    {selectedFacility.images.map((_, index) => (
                      <View
                        key={index}
                        style={[
                          styles.indicator,
                          index === currentImageIndex && styles.activeIndicator,
                          index === currentImageIndex && { backgroundColor: theme.colors.primary }
                        ]}
                      />
                    ))}
                  </View>
                )}
              </View>

              {/* Image-specific Description */}
              <View style={styles.descriptionContainer}>
                <Text style={[styles.imageCounter, { color: theme.colors.primary }]}>
                  Image {currentImageIndex + 1} of {selectedFacility.images.length}
                </Text>
                <Text style={[styles.description, { color: theme.colors.onBackground }]}>
                  {currentImageDescription}
                </Text>
              </View>

              {/* General Facility Description */}
              <View style={styles.generalDescriptionContainer}>
                <Text style={[styles.generalDescriptionTitle, { color: theme.colors.onBackground }]}>
                  About this facility:
                </Text>
                <Text style={[styles.generalDescription, { color: theme.colors.onSurfaceVariant }]}>
                  {selectedFacility.generalDescription}
                </Text>
              </View>

              {/* Proceed Button */}
              <View style={styles.modalButtonContainer}>
                <Button 
                  mode="contained" 
                  onPress={handleNext}
                  style={styles.proceedButton}
                  contentStyle={styles.proceedButtonContent}
                >
                  Proceed to {selected === 3 ? 'Amenities' : 'Date Selection'}
                </Button>
              </View>
            </View>
          )}
        </View>
      </Modal>

      {/* Original Next Button (still visible when modal is closed) */}
      {selected !== null && !modalVisible && (
        <View style={styles.nextContainer}>
          <Text
            style={[
              styles.selectedText,
              { color: theme.colors.onBackground },
            ]}
          >
            Selected: {selectedFacility?.name ?? "Unknown"}
          </Text>
          <Button mode="contained" onPress={handleNext}>
            Next
          </Button>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    marginVertical: 8,
    borderRadius: 16,
    elevation: 4,
  },
  touchable: {
    padding: 20,
  },
  cardContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  cardText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111827",
    textAlign: "center",
  },
  tapText: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 4,
    textAlign: "center",
  },
  nextContainer: {
    marginTop: 24,
    alignItems: "center",
    gap: 12,
  },
  selectedText: {
    fontSize: 16,
    fontWeight: "500",
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  carouselContainer: {
    height: 300,
    position: 'relative',
    marginTop: 20,
  },
  imageContainer: {
    width: screenWidth,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  image: {
    width: '90%',
    height: '90%',
    maxWidth: 400,
    maxHeight: 250,
  },
  navigationContainer: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    transform: [{ translateY: -15 }],
  },
  navButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#d1d5db',
    marginHorizontal: 4,
  },
  activeIndicator: {
    width: 20,
  },
  descriptionContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    marginVertical: 5,
  },
  imageCounter: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '500',
  },
  generalDescriptionContainer: {
    padding: 16,
    backgroundColor: '#f8f9fa',
    marginHorizontal: 20,
    borderRadius: 12,
    marginVertical: 5,
  },
  generalDescriptionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  generalDescription: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  modalButtonContainer: {
    padding: 20,
    paddingBottom: 34,
  },
  proceedButton: {
    borderRadius: 12,
  },
  proceedButtonContent: {
    paddingVertical: 8,
  },
});