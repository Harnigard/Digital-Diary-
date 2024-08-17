import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { RFPercentage } from "react-native-responsive-fontsize";
type Tools = 'pencil' | 'eraser'

interface DrawingToolsProps {
    activeTool: Tools | null;
    onToolChange: (tool: Tools) => void;
}

const DrawingTools: React.FC<DrawingToolsProps> = ({ activeTool, onToolChange }) => {
    return (
        <View style={styles.toolsContainer}>
            <TouchableOpacity onPress={() => onToolChange('pencil')} activeOpacity={1}>
                <MaterialCommunityIcons
                    name="lead-pencil"
                    size={RFPercentage(2)}
                    style={[styles.iconHeader, { color: activeTool === 'pencil' ? Colors.highlightedText : Colors.primaryText }]}
                />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onToolChange('eraser')} activeOpacity={1}>
                <MaterialCommunityIcons
                    name="eraser"
                    size={RFPercentage(2)}
                    style={[styles.iconHeader, { color: activeTool === 'eraser' ? Colors.highlightedText : Colors.primaryText }]}
                />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    toolsContainer: {
        flexDirection: 'row',
    },
    iconHeader: {
        borderColor: Colors.borderColor,
        borderWidth: RFPercentage(0.145),
        textAlign: 'center',
        borderRadius: RFPercentage(2),
        padding: 3,
        marginLeft: RFPercentage(1),
    },
});

export default DrawingTools;
