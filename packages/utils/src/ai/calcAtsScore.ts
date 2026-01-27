import { generalAtsReportSchema , GeneralAtsReport } from "@resume-buddy/schemas";

export function calcAtsScore(atsReport: GeneralAtsReport): number {
    const parsedReport = generalAtsReportSchema.safeParse(atsReport);
    if (!parsedReport.success) {
        console.log(atsReport)
        console.error("Invalid ATS Report:", parsedReport.error);
        throw new Error("Invalid ATS Report structure");
    }

    const signals = parsedReport.data.globalSignals;
    let totalScore = 0;
    const signalWeights: Record<string, number> = {
        workEvidence: 20,
        skillApplication: 15,
        outcomeImpact: 15,
        clarityStructure: 10,
        consistency: 10,
        specificity: 10,
        effortSignal: 10,
        redFlags: 10,
    };
    // Calculate actual max score based on weights
    const maxScore = Object.values(signalWeights).reduce((a, b) => a + b, 0);
    for (const [signalName, signal] of Object.entries(signals)) {
        const weight = signalWeights[signalName] || 0;
        const normalizedLevel = signal.level / 3; // 0-3 scale to 0-1
        
        if (signalName === "redFlags") {
            // Square the penalty for harsher reduction
            const penalty = normalizedLevel * normalizedLevel;  // x²
            totalScore += (1 - penalty) * weight;
        } else {
            totalScore += normalizedLevel * weight;
        }
    }

    const atsScore = Math.round((totalScore / maxScore) * 100);
    return atsScore;
}