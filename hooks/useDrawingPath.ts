import { useState } from 'react';
import { SkPath, SkPaint } from '@shopify/react-native-skia';

type Drawing = {
    path: SkPath;
    paint: SkPaint;
};

const useDrawingPaths = () => {
    const [drawings, setDrawings] = useState<Record<string, Drawing[]>>({});

    const handlePathsChange = (dateKey: string, newPaths: Drawing[]) => {
        setDrawings(prevDrawings => {
            const updatedDrawings = { ...prevDrawings };
            if (newPaths.length === 0) {
                delete updatedDrawings[dateKey];
            } else {
                updatedDrawings[dateKey] = newPaths;
            }
            return updatedDrawings;
        });
    };

    return { drawings, handlePathsChange };
};

export default useDrawingPaths;
