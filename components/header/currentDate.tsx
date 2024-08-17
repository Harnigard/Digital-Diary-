import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import Colors from "@/constants/Colors";
import {RFPercentage} from "react-native-responsive-fontsize";

interface CurrentDateProps {
    onPress: (date: Date) => void;
}

const CurrentDate: React.FC<CurrentDateProps> = ({ onPress }) => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    };
    const formattedDate = today.toLocaleDateString('en-US', options);

    const handlePress = () => {
        onPress(today);
    };

    return (
        <TouchableOpacity onPress={handlePress} activeOpacity={1}>
            <Text style={styles.dateText}>{formattedDate}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    dateText: {
        fontSize: RFPercentage(1.7),
        color: Colors.primaryText,
        fontFamily: 'Roboto-Regular',
        fontWeight: 'thin',
        letterSpacing: 2.5
    },
});

export default CurrentDate;
