export const getSampleTasks = (currentDate) => {
  return [
    {
  "id": 101,
  "title": "Q4 2023 Strategy Planning Meeting",
  "description": "Annual planning session for Q4 business strategy and team alignment",
  "priority": "high",
  "assignedTo": "Sarah Johnson",
  "dueDate": "2023-10-15",
  "dueTime": "14:30",
  "shift": "PM",
  "status": "pending",
  "location": "Executive Conference Room",
  "meetingType": "planning",
  "duration": "120",
  "durationUnit": "minutes",
  "attendees": [
    "Sarah Johnson",
    "Michael Chen",
    "Lisa Rodriguez",
    "David Wilson",
    "Emily Parker",
    "Robert Kim"
  ],
  "agendaPoints": [
    {
      "id": 1,
      "title": "Opening Remarks & Q3 Review",
      "description": "Welcome and recap of Q3 achievements, challenges, and key metrics",
      "presenter": "Sarah Johnson",
      "duration": "15",
      "status": "pending",
      "notes": "Focus on financial performance and team achievements",
      "attachments": [
        {
          "name": "Q3_Financial_Report.pdf",
          "type": "pdf",
          "url": "https://drive.company.com/files/Q3_Financial_Report.pdf",
          "size": "3.2MB"
        }
      ]
    },
    {
      "id": 2,
      "title": "Market Analysis & Competitor Updates",
      "description": "Review current market trends, competitor activities, and opportunities",
      "presenter": "Michael Chen",
      "duration": "25",
      "status": "pending",
      "notes": "Include new market entrants and regulatory changes",
      "attachments": [
        {
          "name": "Market_Analysis_Q4.xlsx",
          "type": "excel",
          "url": "https://drive.company.com/files/Market_Analysis_Q4.xlsx",
          "size": "4.5MB"
        },
        {
          "name": "Competitor_Comparison.pptx",
          "type": "powerpoint",
          "url": "https://drive.company.com/files/Competitor_Comparison.pptx",
          "size": "8.7MB"
        }
      ]
    },
    {
      "id": 3,
      "title": "Q4 Goals & Objectives",
      "description": "Define specific, measurable goals for Q4 across all departments",
      "presenter": "Lisa Rodriguez",
      "duration": "30",
      "status": "pending",
      "notes": "Align with annual company objectives and budget",
      "attachments": [
        {
          "name": "Q4_Goals_Proposal.docx",
          "type": "word",
          "url": "https://drive.company.com/files/Q4_Goals_Proposal.docx",
          "size": "2.1MB"
        }
      ]
    },
    {
      "id": 4,
      "title": "Resource Allocation & Budget",
      "description": "Discuss budget requirements and resource distribution for Q4 initiatives",
      "presenter": "David Wilson",
      "duration": "20",
      "status": "pending",
      "notes": "Include headcount planning and equipment needs",
      "attachments": [
        {
          "name": "Q4_Budget_Proposal.xlsx",
          "type": "excel",
          "url": "https://drive.company.com/files/Q4_Budget_Proposal.xlsx",
          "size": "6.3MB"
        }
      ]
    },
    {
      "id": 5,
      "title": "Departmental Action Plans",
      "description": "Each department lead presents their specific Q4 execution plan",
      "presenter": "All Department Heads",
      "duration": "25",
      "status": "pending",
      "notes": "5 minutes per department maximum",
      "attachments": []
    },
    {
      "id": 6,
      "title": "Risk Assessment & Mitigation",
      "description": "Identify potential risks and discuss mitigation strategies",
      "presenter": "Emily Parker",
      "duration": "15",
      "status": "pending",
      "notes": "Focus on market risks and operational challenges",
      "attachments": [
        {
          "name": "Risk_Matrix.pdf",
          "type": "pdf",
          "url": "https://drive.company.com/files/Risk_Matrix.pdf",
          "size": "1.8MB"
        }
      ]
    },
    {
      "id": 7,
      "title": "Closing & Next Steps",
      "description": "Summarize decisions, assign action items, and schedule follow-up",
      "presenter": "Sarah Johnson",
      "duration": "10",
      "status": "pending",
      "notes": "Document all action items with owners and deadlines",
      "attachments": []
    }
  ],
  "files": [
    {
      "id": 1,
      "name": "Meeting_Agenda.pdf",
      "type": "pdf",
      "url": "https://drive.company.com/files/Meeting_Agenda.pdf",
      "size": "1.5MB"
    },
    {
      "id": 2,
      "name": "Previous_Meeting_Minutes.docx",
      "type": "word",
      "url": "https://drive.company.com/files/Previous_Meeting_Minutes.docx",
      "size": "0.8MB"
    },
    {
      "id": 3,
      "name": "Annual_Strategy_Review.mp4",
      "type": "video",
      "url": "https://drive.company.com/files/Annual_Strategy_Review.mp4",
      "size": "156MB"
    }
  ],
  "notes": "This meeting requires preparation from all attendees. Please review all attachments before the meeting. The room will be set up with video conference equipment for remote participants.",
  "createdAt": "2023-10-10T09:00:00Z",
  "createdBy": "Sarah Johnson",
  "reminders": [
    "24 hours before",
    "1 hour before"
  ],
  "videoConferenceLink": "https://zoom.company.com/j/123456789",
  "conferenceRoomDetails": {
    "room": "Conference Room A",
    "capacity": 20,
    "equipment": [
      "Projector",
      "Video Conference System",
      "Whiteboard",
      "Wireless Presentation"
    ],
    "contact": "Facilities Desk, ext. 1234"
  }
},
    {
      id: 2,
      title: 'Check Fire Extinguishers',
      description: 'Monthly inspection of all fire extinguishers',
      priority: 'critical',
      assignedTo: 'All',
      dueDate: currentDate,
      dueTime: '10:00',
      shift: 'AM',
      status: 'pending',
      category: 'safety',
      createdAt: new Date().toISOString()
    },
    {
      id: 3,
      title: 'Clean Restrooms',
      description: 'Hourly check and cleaning',
      priority: 'medium',
      assignedTo: 'Attendant',
      dueDate: currentDate,
      dueTime: '11:00',
      shift: 'AM',
      status: 'completed',
      category: 'maintenance',
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString()
    }
  ];
};