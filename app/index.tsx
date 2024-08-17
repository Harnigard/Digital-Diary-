import React, { useState } from 'react';
import { View, StyleSheet, Text, ImageBackground, TouchableOpacity } from 'react-native';
import { RFPercentage } from "react-native-responsive-fontsize";
import { SkPath, SkPaint } from '@shopify/react-native-skia';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { getYear } from "date-fns";
// COMPONENTS
import DrawingScreen from "@/components/drawing/drawingScreen";
import DrawingTools from "@/components/drawing/drawingTools";
import MonthCalendar from "@/components/calendar/mouthComponent";
import CurrentDate from "@/components/header/currentDate";
// HOOKS
import { useSwipe } from "@/hooks/useSwipe";
import { useYearState } from '@/hooks/useYearState';
import useCalendarData from '@/hooks/useCalendarData';
import useSelectedDate from "@/hooks/useSelectedDate";
import useFormattedDate from "@/hooks/useFormatedDate";
import useDrawingPaths from "@/hooks/useDrawingPath";
// TYPES
type Tools = 'pencil' | 'eraser';

const DiaryEntry: React.FC = () => {
    const [activeTool, setActiveTool] = useState<Tools>('pencil');
    const [independentPaths, setIndependentPaths] = useState<{ path: SkPath, paint: SkPaint }[]>([]);
    const { drawings, handlePathsChange } = useDrawingPaths();
    const { currentYear, incrementYear, decrementYear, setCurrentYear } = useYearState();
    const { selectedDate, setSelectedDate, handleDatePress } = useSelectedDate(currentYear);
    const calendarData = useCalendarData(currentYear);
    const { formatSelectedDate } = useFormattedDate();

    const handleToolChange = (tool: Tools) => {
        setActiveTool(tool);
    };

    const formatDateToLines = (dateString: string) => {
        const [weekday, month, day, year] = dateString.split(' ');
        return (
            <>
                <Text style={styles.dateText}>{weekday}</Text>
                <Text style={styles.dateText}>{month} {day}</Text>
                <Text style={styles.dateText}>{year}</Text>
            </>
        );
    };

    const getCurrentDateKey = () => {
        return selectedDate ? `${selectedDate.day}-${selectedDate.month}-${selectedDate.year}` : '';
    };

    const currentPaths = drawings[getCurrentDateKey()] || [];
    const highlightedDates = Object.keys(drawings);

    const resetToCurrentDate = () => {
        const today = new Date();
        const year = getYear(today);
        setCurrentYear(year);
        handleDatePress(today);
    };

    const swipeHandlers = useSwipe({
        onSwipedUp: incrementYear,
        onSwipedDown: decrementYear,
    });

    return (
        <SafeAreaView style={styles.safeContainer}>
            <ImageBackground source={require('../assets/images/paper-texture.jpg')} style={styles.container} resizeMode='cover'>
                <View style={styles.header}>
                    <TouchableOpacity onPress={resetToCurrentDate}>
                        <CurrentDate onPress={resetToCurrentDate} />
                    </TouchableOpacity>
                    <DrawingTools activeTool={activeTool} onToolChange={handleToolChange} />
                </View>
                <View style={styles.mainContent}>
                    <View style={styles.sidebarContainer} {...swipeHandlers}>
                        <TouchableOpacity onPress={decrementYear} style={styles.iconNavigate}>
                            <MaterialCommunityIcons name="chevron-up" size={RFPercentage(2)} color={Colors.primaryText} />
                        </TouchableOpacity><View style={styles.sidebar}>

                            <View style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
                                {calendarData.map((monthData, index) => (
                                    <MonthCalendar
                                        key={index}
                                        month={monthData.month}
                                        year={monthData.year}
                                        startDay={monthData.startDay}
                                        days={monthData.days}
                                        selectedDate={selectedDate}
                                        setSelectedDate={setSelectedDate}
                                        highlightedDates={highlightedDates}
                                    />
                                ))}


                            </View>

                        </View><TouchableOpacity onPress={incrementYear} style={styles.iconNavigate}>
                        <MaterialCommunityIcons name="chevron-down" size={RFPercentage(2)} color={Colors.primaryText} />
                    </TouchableOpacity>
                    </View>
                    <View style={styles.entry}>
                        <View style={styles.staticDraw}>
                            <DrawingScreen
                                activeTool={activeTool}
                                paths={independentPaths}
                                onPathsChange={setIndependentPaths} // окремий блок малювання
                            />
                        </View>
                        <ImageBackground source={require('../assets/images/notebook-lines.png')} resizeMode='stretch' style={styles.mainDraw}>
                            <DrawingScreen
                                activeTool={activeTool}
                                paths={currentPaths}
                                onPathsChange={newPaths => handlePathsChange(getCurrentDateKey(), newPaths)} // від дати
                            />
                            {selectedDate && (
                                <View style={styles.dateOverlay} pointerEvents="none">
                                    {formatDateToLines(formatSelectedDate(selectedDate))}
                                </View>
                            )}
                        </ImageBackground>
                    </View>
                </View>
            </ImageBackground>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow:1,
        backgroundColor: Colors.background,
        borderWidth: 1,
        borderColor: Colors.borderColor,
    },
    header: {
        textAlign: 'left',
        paddingHorizontal: RFPercentage(2),
        borderColor: Colors.borderColor,
        borderWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '3%',
    },
    mainContent: {
        flexDirection: 'row',
        flex: 1,
    },
    sidebar: {
        display: 'flex',
        height: '100%'
    },
    staticDraw: {
        height: '26%',
    },
    mainDraw: {
        borderTopColor: Colors.borderColor,
        borderTopWidth: 1.5,
        flex: 1,
    },
    entry: {
        flex: 1,
        borderColor: Colors.borderColor,
        borderWidth: 1,
    },
    iconHeader: {
        borderColor: Colors.borderColor,
        borderWidth: 2,
        borderRadius: 20,
        padding: 5,
        marginLeft: 15,
    },
    iconNavigate: {
        borderWidth: 1,
        borderColor: Colors.borderColor,
        alignSelf: 'stretch',
        //textAlign: 'center',
        //justifyContent: 'center',
        alignItems: 'center',
        height: '2%'
    },
    dateOverlay: {
        position: 'absolute',
        top: RFPercentage(1),
        left: RFPercentage(1),
        padding: 5,
        borderRadius: 5,
    },
    dateText: {
        fontSize: RFPercentage(1.7),
        textAlign: 'center',
        marginLeft: RFPercentage(1),
        color: Colors.primaryText,
        fontFamily: 'Roboto-Regular',
    },
    sidebarContainer: {
       width: '13%',
       height: '96.2%'
    },
    toolsContainer: {
        flexDirection: 'row',
    },
    safeContainer: {
        flex: 1,
    },
});

export default DiaryEntry;