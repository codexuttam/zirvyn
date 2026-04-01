import prisma from '../utils/prisma.js';

export const dashboardService = {
    async getSummary(userId: string, role: string) {
        const where: any = { deletedAt: null };
        if (role !== 'ADMIN') {
            where.userId = userId;
        }

        const records = await prisma.financialRecord.findMany({
            where,
        });

        const summary = records.reduce(
            (acc: { totalIncome: number, totalExpenses: number, netBalance: number, categoryWiseTotals: Record<string, number> }, record: { type: string, amount: number, category: string | null }) => {
                if (record.type === 'INCOME') {
                    acc.totalIncome += record.amount;
                } else {
                    acc.totalExpenses += record.amount;
                }

                const category = record.category || 'Other';
                acc.categoryWiseTotals[category] = (acc.categoryWiseTotals[category] || 0) + record.amount;

                return acc;
            },
            {
                totalIncome: 0,
                totalExpenses: 0,
                netBalance: 0,
                categoryWiseTotals: {} as Record<string, number>,
            }
        );

        summary.netBalance = summary.totalIncome - summary.totalExpenses;

        const recentActivity = await prisma.financialRecord.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: 5,
            include: { user: { select: { name: true } } },
        });

        // Simple monthly trend (last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const trendRecords = await prisma.financialRecord.findMany({
            where: {
                ...where,
                date: { gte: sixMonthsAgo }
            },
            orderBy: { date: 'asc' }
        });

        const monthlyTrends: Record<string, { income: number, expense: number }> = {};

        // Pre-fill last 6 months
        for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            const month = d.toISOString().slice(0, 7);
            monthlyTrends[month] = { income: 0, expense: 0 };
        }

        trendRecords.forEach((r: { date: Date, type: string, amount: number }) => {
            const month = r.date.toISOString().slice(0, 7); // YYYY-MM
            if (monthlyTrends[month]) {
                if (r.type === 'INCOME') monthlyTrends[month].income += r.amount;
                else monthlyTrends[month].expense += r.amount;
            }
        });

        return {
            summary,
            recentActivity,
            monthlyTrends: Object.entries(monthlyTrends)
                .map(([month, data]) => ({ month, ...data }))
                .sort((a, b) => a.month.localeCompare(b.month))
        };
    },
};
