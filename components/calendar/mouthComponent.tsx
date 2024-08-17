import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Colors from '@/constants/Colors';
import { RFPercentage } from "react-native-responsive-fontsize";

const { height } = Dimensions.get('screen');

interface MonthCalendarProps {
    month: string;
    year: number;
    startDay: number;
    days: number;
    selectedDate: { day: number, month: string, year: number } | null;
    setSelectedDate: (date: { day: number, month: string, year: number }) => void;
    highlightedDates: string[];
}

const MonthCalendar: React.FC<MonthCalendarProps> = ({ month, year, startDay, days, selectedDate, setSelectedDate, highlightedDates }) => {
    const renderDays = () => {
        const dayArray = Array.from({ length: days }, (_, i) => i+1);
        const emptyDays = Array.from({ length: startDay-1 }, (_, i) => i);
        return [...emptyDays.map((_, i) => (

            <View key={`empty-${i}`} style={styles.day} />
        )), ...dayArray.map(day => {
            const dateKey = `${day}-${month}-${year}`;
            const isSelected = selectedDate?.day === day && selectedDate?.month === month && selectedDate?.year === year;
            const isHighlighted = highlightedDates.includes(dateKey);
            return (
                <TouchableOpacity
                    key={day}
                    style={[styles.day, isSelected && styles.selectedDay, isHighlighted && styles.highlightedDay]}
                    onPress={() => setSelectedDate({ day, month, year })}
                >
                    <Text style={[styles.dayText, isSelected && styles.selectedDayText]}>
                        {day}
                    </Text>
                </TouchableOpacity>
            );
        })];
    };

    const renderWeekDays = () => {
        const smallDayTitle = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
        return smallDayTitle.map((day, index) => (
            <View key={index} style={styles.weekDay}>
                <Text style={styles.weekDayText}>{day}</Text>
            </View>
        ));
    };

    return (
        <View style={styles.container}>
            <Text style={styles.monthText}>{month.toUpperCase()} {year}</Text>
            <View style={styles.weekDaysContainer}>
                {renderWeekDays()}
            </View>
            <View style={styles.grid}>
                {renderDays()}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderColor: Colors.borderColor,
        borderWidth: 1,
        flexDirection: 'column',
        height: `${100/12}%`,
    },
    monthText: {
        height: `${100/8}%`,
        textAlign: 'left',
        marginLeft: RFPercentage(0.2),
        fontSize: RFPercentage(0.5),
        fontFamily: 'Roboto-Medium',
    },
    weekDaysContainer: {
        height: `${100/8}%`,
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    weekDay: {
        width: `${100 / 7}%`,
        justifyContent: 'center',
        alignItems: 'center',
    },
    weekDayText: {
        fontSize: RFPercentage(0.4),
        fontFamily: 'Roboto-Regular',
    },
    grid: {
        height: `${500/8}%`,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
    },
    day: {
        width: `${100 / 7}%`,
        height:`${100 / 5}%`,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
    },
    dayText: {

        fontSize: RFPercentage(0.45),
        color: 'black',
        fontFamily: 'Roboto-Regular',
    },
    selectedDay: {
        backgroundColor: 'black',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
    },
    selectedDayText: {
        color: 'white',
        textAlign: 'center',
    },
    highlightedDay: {
        borderColor: 'red',
        borderWidth: 1,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
    },
});


export default MonthCalendar;
