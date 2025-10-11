import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, GestureResponderEvent, Alert, LayoutChangeEvent } from 'react-native';
import { Canvas, Group, Path, Skia, SkPath, PaintStyle, BlendMode, SkPaint, Circle } from '@shopify/react-native-skia';
import { RFPercentage } from "react-native-responsive-fontsize";

interface DrawingCanvasProps {
    activeTool: 'pencil' | 'eraser' | null;
    paths: { path: SkPath, paint: SkPaint }[];
    onPathsChange: (paths: { path: SkPath, paint: SkPaint }[]) => void;
}

const ERASER_RADIUS = RFPercentage(2);
const PENCIL_WIDTH = 0.75;
const ERASER_WIDTH = ERASER_RADIUS * 2;
const VIRTUAL_PADDING = RFPercentage(0.5);

const DrawingScreen: React.FC<DrawingCanvasProps> = ({ activeTool, paths, onPathsChange }) => {
    const [currentPath, setCurrentPath] = useState<SkPath | null>(null);
    const paintRef = useRef<SkPaint>(Skia.Paint());
    const lastPoint = useRef<{ x: number, y: number } | null>(null);
    const [activeTouchId, setActiveTouchId] = useState<number | null>(null);
    const [eraserPosition, setEraserPosition] = useState<{ x: number, y: number } | null>(null);
    const [canvasSize, setCanvasSize] = useState<{ width: number, height: number }>({ width: 0, height: 0 });

    useEffect(() => {
        const newPaint = Skia.Paint();
        newPaint.setStyle(PaintStyle.Stroke);
        newPaint.setAntiAlias(true);

        if (activeTool === 'pencil') {
            newPaint.setColor(Skia.Color('black'));
            newPaint.setStrokeWidth(PENCIL_WIDTH);
        } else if (activeTool === 'eraser') {
            newPaint.setBlendMode(BlendMode.Clear);
            newPaint.setStrokeWidth(ERASER_WIDTH);
        }
        paintRef.current = newPaint;
    }, [activeTool]);

    const isWithinBounds = (x: number, y: number) => {
        return (
            x >= VIRTUAL_PADDING &&
            x <= canvasSize.width - VIRTUAL_PADDING &&
            y >= VIRTUAL_PADDING &&
            y <= canvasSize.height - VIRTUAL_PADDING
        );
    };

    const handleTouchStart = (event: GestureResponderEvent) => {
        if (!activeTool) {
            Alert.alert('Please, select a tool', 'Сhoose pencil or eraser in the upper panel');
            return;
        }
        if (activeTouchId !== null) {
            return;
        }
        const { identifier, locationX, locationY } = event.nativeEvent;
        if (!isWithinBounds(locationX, locationY)) return;

        setActiveTouchId(Number(identifier));
        const path = Skia.Path.Make();
        path.moveTo(locationX, locationY);
        setCurrentPath(path);
        lastPoint.current = { x: locationX, y: locationY };
        if (activeTool === 'eraser') {
            setEraserPosition({ x: locationX, y: locationY });
        }
    };

    const handleTouchMove = (event: GestureResponderEvent) => {
        if (!activeTool) return;
        const { identifier, locationX, locationY } = event.nativeEvent;
        if (Number(identifier) !== activeTouchId || !currentPath || !lastPoint.current) {
            return;
        }
        if (!isWithinBounds(locationX, locationY)) {
            completeCurrentPath();
            return;
        }
        const { x, y } = lastPoint.current;
        const dx = locationX - x;
        const dy = locationY - y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 0.15) {
            const controlPoint1X = x + dx / 3;
            const controlPoint1Y = y + dy / 3;
            const controlPoint2X = x + 2 * dx / 3;
            const controlPoint2Y = y + 2 * dy / 3;

            currentPath.cubicTo(controlPoint1X, controlPoint1Y, controlPoint2X, controlPoint2Y, locationX, locationY);
            setCurrentPath(currentPath.copy());
            lastPoint.current = { x: locationX, y: locationY };
            if (activeTool === 'eraser') {
                setEraserPosition({ x: locationX, y: locationY });
            }
        }
    };

    const handleTouchEnd = (event: GestureResponderEvent) => {
        const { identifier } = event.nativeEvent;
        if (Number(identifier) !== activeTouchId) {
            return;
        }
        completeCurrentPath();
    };

    const handleTouchCancel = (event: GestureResponderEvent) => {
        completeCurrentPath();
    };

    const completeCurrentPath = () => {
        setActiveTouchId(null);
        setEraserPosition(null);
        if (currentPath && currentPath.countPoints() > 1) {
            if (activeTool === 'pencil') {
                const newPaths = [...paths, { path: currentPath, paint: paintRef.current }];
                onPathsChange(newPaths.filter(pathObj => pathObj.path.countPoints() > 1));
            } else if (activeTool === 'eraser') {
                const eraserPathCmds = currentPath.toCmds();
                const newPaths = paths.flatMap(pathObj => {
                    const splitPaths = splitPathByEraser(pathObj.path, eraserPathCmds);
                    return splitPaths.map(segment => ({ path: segment, paint: pathObj.paint }));
                });
                onPathsChange(newPaths.filter(pathObj => pathObj.path.countPoints() > 1));
            }
        }
        setCurrentPath(null);
        lastPoint.current = null;
    };

    const splitPathByEraser = (path: SkPath, eraserCmds: number[][]): SkPath[] => {
        const cmds = path.toCmds();
        const segments: SkPath[] = [];
        let currentSegment = Skia.Path.Make();
        let isErasing = false;

        for (let i = 0; i < cmds.length - 1; i++) {
            const [cmdType1, x1, y1] = cmds[i];
            const [cmdType2, x2, y2] = cmds[i + 1];
            if (cmdType1 === 0) {
                if (currentSegment.toCmds().length > 1 && !isErasing) {
                    segments.push(currentSegment);
                }
                currentSegment = Skia.Path.Make();
                currentSegment.moveTo(x1, y1);
            } else {
                currentSegment.lineTo(x1, y1);
                isErasing = eraserCmds.some(eCmd => isPointNearLine(eCmd[1], eCmd[2], x1, y1, ERASER_RADIUS));

                if (isErasing) {
                    segments.push(currentSegment);
                    currentSegment = Skia.Path.Make();
                    currentSegment.moveTo(x2, y2);
                    isErasing = false;
                } else {
                    currentSegment.lineTo(x2, y2);
                }
            }
        }

        if (currentSegment.toCmds().length > 1 && !isErasing) {
            segments.push(currentSegment);
        }

        return segments.filter(segment => segment.countPoints() > 2);
    };

    const isPointNearLine = (x1: number, y1: number, x2: number, y2: number, threshold: number): boolean => {
        const dx = x2 - x1;
        const dy = y2 - y1;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance <= threshold;
    };

    const handleLayout = (event: LayoutChangeEvent) => {
        const { width, height } = event.nativeEvent.layout;
        //setCanvasSize({ width: width + VIRTUAL_PADDING * 2, height: height + VIRTUAL_PADDING * 2 });
        setCanvasSize({width,height});
    };

    return (
        <View style={styles.container} onLayout={handleLayout}>
            <Canvas
                style={styles.canvas}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onTouchCancel={handleTouchCancel}
            >
                <Group>
                    {paths.map((pathObj, index) => (
                        <Path key={index} path={pathObj.path} paint={pathObj.paint} />
                    ))}
                    {currentPath && <Path path={currentPath} paint={paintRef.current} />}
                    {eraserPosition && (
                        <>
                            <Circle
                                cx={eraserPosition.x}
                                cy={eraserPosition.y}
                                r={ERASER_RADIUS}
                                color="white"
                            />
                            <Circle
                                cx={eraserPosition.x}
                                cy={eraserPosition.y}
                                r={ERASER_RADIUS}
                                style="stroke"
                                strokeWidth={2}
                                color="gray"
                            />
                        </>
                    )}
                </Group>
            </Canvas>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    canvas: {
        flex: 1,
        width: '100%',
        height: '100%',
        backgroundColor: 'transparent',
        padding: VIRTUAL_PADDING,
    },
});

export default DrawingScreen;
