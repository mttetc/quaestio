'use server';

import { getResponseTimeMetrics, getVolumeByTagMetrics } from './metrics';

export async function getQAMetrics() {
    const [responseTime, volumeByTag] = await Promise.all([
        getResponseTimeMetrics(),
        getVolumeByTagMetrics()
    ]);

    return {
        responseTime,
        volumeByTag
    };
} 