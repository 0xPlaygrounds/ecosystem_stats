// Load Google Charts
google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(initializeDashboard);

// Process the CSV data
function processStarHistoryData() {
    // Direct data loading to avoid CORS issues
    const csvData = `Repository,Date,Stars
0xPlaygrounds/rig,Fri Jun 07 2024 14:54:20 GMT-0500 (Central Daylight Time),0
0xPlaygrounds/rig,Wed Dec 11 2024 14:35:13 GMT-0600 (Central Standard Time),390
0xPlaygrounds/rig,Thu Dec 12 2024 16:13:14 GMT-0600 (Central Standard Time),630
0xPlaygrounds/rig,Sun Dec 15 2024 01:43:15 GMT-0600 (Central Standard Time),840
0xPlaygrounds/rig,Thu Dec 19 2024 15:00:49 GMT-0600 (Central Standard Time),1080
0xPlaygrounds/rig,Sun Dec 22 2024 10:33:50 GMT-0600 (Central Standard Time),1290
0xPlaygrounds/rig,Tue Dec 24 2024 06:37:45 GMT-0600 (Central Standard Time),1530
0xPlaygrounds/rig,Sun Dec 29 2024 23:20:34 GMT-0600 (Central Standard Time),1740
0xPlaygrounds/rig,Wed Jan 01 2025 11:01:19 GMT-0600 (Central Standard Time),1980
0xPlaygrounds/rig,Mon Jan 06 2025 12:06:20 GMT-0600 (Central Standard Time),2190
0xPlaygrounds/rig,Wed Jan 15 2025 11:25:15 GMT-0600 (Central Standard Time),2430
0xPlaygrounds/rig,Sat Jan 25 2025 11:11:09 GMT-0600 (Central Standard Time),2640
0xPlaygrounds/rig,Thu Feb 13 2025 07:59:34 GMT-0600 (Central Standard Time),2880
0xPlaygrounds/rig,Sat Mar 01 2025 19:20:20 GMT-0600 (Central Standard Time),3090
0xPlaygrounds/rig,Mon Mar 31 2025 22:41:25 GMT-0500 (Central Daylight Time),3330
0xPlaygrounds/rig,Tue Apr 08 2025 12:00:37 GMT-0500 (Central Daylight Time),3372`;
    
    // Parse the CSV data
    const parsedData = Papa.parse(csvData, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true // Convert numerical strings to numbers
    });
    
    // Format the data for analysis
    const starHistory = parsedData.data.map(row => {
        return {
            repository: row.Repository,
            date: new Date(row.Date),
            stars: row.Stars
        };
    }).sort((a, b) => a.date - b.date); // Ensure chronological order
    
    return starHistory;
}

// Calculate growth metrics from star history data
function calculateGrowthMetrics(data) {
    // Calculate monthly growth
    const monthlyGrowth = [];
    let previousMonth = null;
    let monthStart = null;
    let monthStartStars = 0;
    
    data.forEach(entry => {
        const month = entry.date.getMonth();
        const year = entry.date.getFullYear();
        const currentMonth = `${year}-${month+1}`;
        
        if (currentMonth !== previousMonth) {
            if (previousMonth !== null) {
                // Calculate growth from previous month
                const growth = monthStartStars > 0 ? 
                    ((entry.stars - monthStartStars) / monthStartStars * 100).toFixed(1) : 
                    100;
                
                monthlyGrowth.push({
                    month: previousMonth,
                    startDate: monthStart,
                    endDate: entry.date,
                    startStars: monthStartStars,
                    endStars: entry.stars,
                    absoluteGrowth: entry.stars - monthStartStars,
                    percentageGrowth: growth
                });
            }
            
            previousMonth = currentMonth;
            monthStart = entry.date;
            monthStartStars = entry.stars;
        }
    });

    const firstEntry = data[0];
    const lastEntry = data[data.length - 1];

    // Capture growth for the final month which isn't handled in the loop
    if (previousMonth !== null) {
        const growth = monthStartStars > 0 ?
            ((lastEntry.stars - monthStartStars) / monthStartStars * 100).toFixed(1) :
            100;

        monthlyGrowth.push({
            month: previousMonth,
            startDate: monthStart,
            endDate: lastEntry.date,
            startStars: monthStartStars,
            endStars: lastEntry.stars,
            absoluteGrowth: lastEntry.stars - monthStartStars,
            percentageGrowth: growth
        });
    }
    // Calculate average daily growth rate
    const daysDifference = (lastEntry.date - firstEntry.date) / (1000 * 60 * 60 * 24);
    const totalGrowth = lastEntry.stars - firstEntry.stars;
    const avgDailyGrowth = daysDifference > 0 ? (totalGrowth / daysDifference).toFixed(2) : 0;
    
    // Calculate star velocity for different time periods
    const now = new Date();
    const last30DaysData = data.filter(entry => {
        const timeDiff = now.getTime() - entry.date.getTime();
        const daysDiff = timeDiff / (1000 * 60 * 60 * 24);
        return daysDiff <= 30;
    });
    
    const last90DaysData = data.filter(entry => {
        const timeDiff = now.getTime() - entry.date.getTime();
        const daysDiff = timeDiff / (1000 * 60 * 60 * 24);
        return daysDiff <= 90;
    });
    
    let last30DaysGrowth = 0;
    let last90DaysGrowth = 0;
    
    if (last30DaysData.length >= 2) {
        const first = last30DaysData[0];
        const last = last30DaysData[last30DaysData.length - 1];
        const days = (last.date - first.date) / (1000 * 60 * 60 * 24);
        last30DaysGrowth = days > 0 ? ((last.stars - first.stars) / days).toFixed(2) : 0;
    }
    
    if (last90DaysData.length >= 2) {
        const first = last90DaysData[0];
        const last = last90DaysData[last90DaysData.length - 1];
        const days = (last.date - first.date) / (1000 * 60 * 60 * 24);
        last90DaysGrowth = days > 0 ? ((last.stars - first.stars) / days).toFixed(2) : 0;
    }
    
    return {
        monthlyGrowth,
        avgDailyGrowth,
        totalGrowth,
        daysSinceStart: daysDifference.toFixed(0),
        currentStars: lastEntry.stars,
        velocities: {
            overall: avgDailyGrowth,
            last90Days: last90DaysGrowth,
            last30Days: last30DaysGrowth
        }
    };
}

// Calculate milestone dates (when specific star counts were reached)
function calculateMilestones(starHistory) {
    const milestoneValues = [1000, 2000, 3000];
    const milestones = [];
    
    milestoneValues.forEach(targetStars => {
        for (let i = 1; i < starHistory.length; i++) {
            const prev = starHistory[i-1];
            const curr = starHistory[i];
            
            if (prev.stars < targetStars && curr.stars >= targetStars) {
                // Interpolate to estimate the exact date
                const starsGained = curr.stars - prev.stars;
                const starsNeeded = targetStars - prev.stars;
                const ratio = starsNeeded / starsGained;
                const timeDiff = curr.date - prev.date;
                const estimatedDate = new Date(prev.date.getTime() + (timeDiff * ratio));
                
                const daysFromStart = ((estimatedDate - starHistory[0].date) / (1000 * 60 * 60 * 24)).toFixed(0);
                
                milestones.push({
                    stars: targetStars,
                    label: `${(targetStars/1000).toFixed(0)}k Stars`,
                    date: estimatedDate,
                    formattedDate: formatDate(estimatedDate),
                    daysFromStart: daysFromStart
                });
                
                break;
            }
        }
    });
    
    return milestones;
}

// Format date to a readable format
function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Shorter date format for chart tooltips
function formatShortDate(date) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Update milestone cards
function updateMilestoneCards(milestones) {
    // Clear the milestone cards if no milestones available
    if (!milestones || milestones.length === 0) {
        document.getElementById('milestone1Card').innerHTML = '';
        document.getElementById('milestone2Card').innerHTML = '';
        document.getElementById('milestone3Card').innerHTML = '';
        return;
    }
    
    // Update each milestone card with its data
    const cardIds = ['milestone1Card', 'milestone2Card', 'milestone3Card'];
    
    milestones.forEach((milestone, index) => {
        if (index < 3) { // We only have 3 milestone cards
            const cardId = cardIds[index];
            const card = document.getElementById(cardId);
            
            card.innerHTML = `
                <div class="text-indigo-600 font-medium">${milestone.stars.toLocaleString()} Stars Milestone</div>
                <div class="text-lg font-semibold">${formatDate(milestone.date)}</div>
                <div class="text-sm text-gray-600">Reached in ${milestone.daysFromStart} days</div>
            `;
        }
    });
}

// Create the Google Chart
function drawStarGrowthChart(data, timeRange = 'all') {
    // Calculate metrics for use in the chart
    const metrics = calculateGrowthMetrics(data);
    // Filter data based on time range
    let filteredData = [...data];
    const now = new Date();
    
    if (timeRange === 'last30') {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - 30);
        filteredData = data.filter(entry => entry.date >= cutoffDate);
    } else if (timeRange === 'last90') {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - 90);
        filteredData = data.filter(entry => entry.date >= cutoffDate);
    }
    
    // Prepare data for Google Charts
    const chartData = new google.visualization.DataTable();
    chartData.addColumn('date', 'Date');
    chartData.addColumn('number', 'Stars');
    
    filteredData.forEach(entry => {
        chartData.addRow([entry.date, entry.stars]);
    });

    // Check if we're on mobile
    const isMobile = window.innerWidth < 768;

    // Define chart options with responsive settings
    const options = {
        title: '',
        height: isMobile ? 300 : 400,
        backgroundColor: '#ffffff',
        chartArea: {
            width: isMobile ? '80%' : '85%',
            height: isMobile ? '70%' : '75%'
        },
        legend: {
            position: 'top',
            alignment: 'end',
            textStyle: {
                fontName: 'Inter, sans-serif',
                fontSize: isMobile ? 10 : 12
            }
        },
        hAxis: {
            format: isMobile ? 'MMM yy' : 'MMM yyyy', // Shorter date format on mobile
            gridlines: {
                count: isMobile ? 3 : 5, // Fewer gridlines on mobile
                color: '#f3f4f6'
            },
            textStyle: {
                fontName: 'Inter, sans-serif',
                fontSize: isMobile ? 9 : 11
            }
        },
        vAxis: {
            title: 'GitHub Stars',
            titleTextStyle: {
                fontName: 'Inter, sans-serif',
                fontSize: isMobile ? 10 : 12,
                italic: false
            },
            gridlines: {
                count: isMobile ? 4 : 5,
                color: '#f3f4f6'
            },
            textStyle: {
                fontName: 'Inter, sans-serif',
                fontSize: isMobile ? 9 : 11
            }
        },
        colors: ['#4f46e5'],
        lineWidth: 2,
        pointSize: isMobile ? 3 : 4,
        pointShape: 'circle',
        tooltip: {
            textStyle: {
                fontName: 'Inter, sans-serif',
                fontSize: isMobile ? 10 : 12
            }
        }
    };

    // Draw the chart
    const chartDiv = document.getElementById('starGrowthChart');
    const chart = new google.visualization.LineChart(chartDiv);
    
    // Calculate milestone data
    const milestones = calculateMilestones(data);
    
    // Update the average growth rate in the static card
    document.getElementById('avgGrowthRate').textContent = metrics.velocities.overall + ' stars/day';
    
    // Add or hide milestone cards based on time range
    if (timeRange === 'all') {
        // Update milestone cards with data
        updateMilestoneCards(milestones);
        
        // Draw the chart with the main data
        chart.draw(chartData, options);
    } else {
        // Clear milestone cards for filtered views
        updateMilestoneCards([]);
        
        // Draw the chart with the filtered data
        chart.draw(chartData, options);
    }
    
    return chart;
}

// Setup time filter buttons
function setupTimeFilterButtons(data) {
    const allTimeBtn = document.getElementById('allTimeBtn');
    const last90DaysBtn = document.getElementById('last90DaysBtn');
    const last30DaysBtn = document.getElementById('last30DaysBtn');
    let currentChart = null;
    
    const resetButtonStyles = () => {
        allTimeBtn.className = 'px-3 py-1 rounded text-sm font-medium bg-gray-100 text-gray-700';
        last90DaysBtn.className = 'px-3 py-1 rounded text-sm font-medium bg-gray-100 text-gray-700';
        last30DaysBtn.className = 'px-3 py-1 rounded text-sm font-medium bg-gray-100 text-gray-700';
    };
    
    // Initial chart (all time)
    currentChart = drawStarGrowthChart(data, 'all');
    allTimeBtn.className = 'px-3 py-1 rounded text-sm font-medium bg-indigo-100 text-indigo-700';
    
    // Setup event listeners
    allTimeBtn.addEventListener('click', () => {
        resetButtonStyles();
        allTimeBtn.className = 'px-3 py-1 rounded text-sm font-medium bg-indigo-100 text-indigo-700';
        currentChart = drawStarGrowthChart(data, 'all');
    });
    
    last90DaysBtn.addEventListener('click', () => {
        resetButtonStyles();
        last90DaysBtn.className = 'px-3 py-1 rounded text-sm font-medium bg-indigo-100 text-indigo-700';
        currentChart = drawStarGrowthChart(data, 'last90');
    });
    
    last30DaysBtn.addEventListener('click', () => {
        resetButtonStyles();
        last30DaysBtn.className = 'px-3 py-1 rounded text-sm font-medium bg-indigo-100 text-indigo-700';
        currentChart = drawStarGrowthChart(data, 'last30');
    });
}

// Update dashboard stats with data
function updateDashboardStats(data, metrics) {
    // Update key stat cards
    document.getElementById('currentStars').textContent = metrics.currentStars.toLocaleString();
    document.getElementById('starVelocity').textContent = metrics.velocities.overall;
    
    // Find the growth for the last 30 days
    if (metrics.monthlyGrowth.length > 0) {
        const lastMonthGrowth = metrics.monthlyGrowth[metrics.monthlyGrowth.length - 1];
        document.getElementById('starsGrowthRate').textContent = `+${lastMonthGrowth.absoluteGrowth} in last 30 days`;
    }
    
    document.getElementById('velocityTrend').textContent = `${metrics.daysSinceStart} days since launch`;
}

// Initialize the dashboard
function initializeDashboard() {
    try {
        // Process the star history data
        const starHistory = processStarHistoryData();
        
        // Calculate growth metrics
        const metrics = calculateGrowthMetrics(starHistory);
        
        // Setup time filter buttons and initial chart
        setupTimeFilterButtons(starHistory);
        
        // Update dashboard stats
        updateDashboardStats(starHistory, metrics);
        
        // Add animations for stat cards
        const statCards = document.querySelectorAll('.stat-card');
        statCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
        
        // Add window resize handler for responsive charts
        window.addEventListener('resize', function() {
            // Redraw the chart when window is resized
            // Using debounce to prevent excessive redraws
            clearTimeout(window.resizeTimer);
            window.resizeTimer = setTimeout(function() {
                setupTimeFilterButtons(starHistory);
            }, 250);
        });
    } catch (error) {
        console.error('Error initializing dashboard:', error);
    }
}

// Replace image placeholders with actual colored boxes for the demo
document.addEventListener('DOMContentLoaded', function() {
    const partnerLogos = document.querySelectorAll('.partner-logo');
    partnerLogos.forEach(logo => {
        const parent = logo.parentElement;
        const color = `hsl(${Math.random() * 360}, 70%, 85%)`;
        const placeholder = document.createElement('div');
        placeholder.style.width = '120px';
        placeholder.style.height = '40px';
        placeholder.style.backgroundColor = color;
        placeholder.style.borderRadius = '4px';
        placeholder.className = 'partner-logo mb-2';
        
        // Replace the img with the colored div
        parent.replaceChild(placeholder, logo);
    });
});
