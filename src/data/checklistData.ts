// data/checklistData.js
import { Users, Clock, TrendingUp, Fuel, DollarSign, Shield, AlertCircle } from 'lucide-react';

export const checklistSections = [
  {
    title: "Morning Self-Care (3:30 AM - 4:30 AM)",
    icon: Users,
    color: "bg-cyan-500",
    items: [
      { id: 'selfcare-1', task: 'Wake up and get out of bed', priority: 'high', why: 'Start your day with discipline - how you begin determines your entire day', advice: 'Place alarm across the room so you have to stand up. No snooze button - it ruins sleep quality. Make bed immediately after rising.', tools: 'Alarm clock, smartphone' },
      { id: 'selfcare-2', task: 'Use the toilet', priority: 'high', why: 'Empty your body to feel light and focused for the day ahead', advice: 'Take your time, don\'t rush. Stay hydrated the night before for regularity. Proper posture helps complete emptying.', tools: 'Toilet, toilet paper' },
      { id: 'selfcare-3', task: 'Wash hands thoroughly', priority: 'high', why: 'Kill germs and bacteria - prevents illness and shows professionalism', advice: 'Use warm water, 20 seconds minimum with soap. Scrub between fingers, under nails, and wrists. Pat dry completely to prevent chapping.', tools: 'Soap, warm water, clean towel' },
      { id: 'selfcare-4', task: 'Brush teeth (2 minutes minimum)', priority: 'high', why: 'Prevents cavities, gum disease, and bad breath - protects your smile and health', 
        advice: 'Follow the proper sequence for complete coverage:', 
        adviceSteps: [
          'Wet toothbrush with water',
          'Apply pea-sized amount of fluoride toothpaste',
          'Brush outer surfaces of upper teeth (30 sec)',
          'Brush outer surfaces of lower teeth (30 sec)',
          'Brush inner surfaces of upper teeth (30 sec)',
          'Brush inner surfaces of lower teeth (30 sec)',
          'Brush chewing surfaces of all teeth (20 sec)',
          'Brush your tongue (10 sec)',
          'Brush roof of mouth (10 sec)',
          'Rinse mouth thoroughly with water',
          'Rinse toothbrush and store upright'
        ],
        tools: 'Toothbrush (soft bristles), fluoride toothpaste, timer'
      },
      { id: 'selfcare-5', task: 'Floss between teeth', priority: 'medium', why: 'Removes 40% of plaque brushing misses - prevents heart disease and tooth loss', advice: 'Use 18 inches of floss, wrap around fingers. Gently curve around each tooth in C-shape. Don\'t snap or force - be gentle on gums.', tools: 'Dental floss or floss picks' },
      { id: 'selfcare-6', task: 'Use mouthwash', priority: 'medium', why: 'Kills bacteria brushing can\'t reach - fresh breath builds confidence', advice: 'Swish for 30-60 seconds, don\'t swallow. Use alcohol-free if you have sensitive gums. Wait 30 minutes before eating/drinking.', tools: 'Antiseptic mouthwash, cup' },
      { id: 'selfcare-7', task: 'Wash face with facial cleanser', priority: 'high', why: 'Removes oil and dirt - prevents acne and keeps you looking professional', advice: 'Use lukewarm water, not hot. Massage cleanser in circular motions for 60 seconds. Rinse thoroughly and pat dry, don\'t rub.', tools: 'Facial cleanser, washcloth, towel' },
      { id: 'selfcare-8', task: 'Apply moisturizer/face cream', priority: 'medium', why: 'Prevents dry, aged skin - you look younger and more energetic', advice: 'Apply while skin is still slightly damp. Use upward motions to prevent sagging. SPF moisturizer is best for day use.', tools: 'Moisturizer with SPF, clean hands' },
      { id: 'selfcare-9', task: 'Shower/bathe thoroughly', priority: 'high', why: 'Removes sweat and bacteria - you smell clean and feel refreshed', advice: 'Start with warm water, end with cool to close pores. Wash from top to bottom. Focus on armpits, groin, and feet. Don\'t forget behind ears and neck.', tools: 'Soap/body wash, shampoo, washcloth/loofah, towel' },
      { id: 'selfcare-10', task: 'Shampoo and condition hair', priority: 'medium', why: 'Clean hair prevents dandruff and odor - shows you respect yourself', advice: 'Massage scalp with fingertips, not nails. Rinse shampoo completely before conditioning. Apply conditioner to ends only, not roots.', tools: 'Shampoo, conditioner, shower' },
      { id: 'selfcare-11', task: 'Clean and trim fingernails (if needed)', priority: 'low', why: 'Dirty nails carry germs and look unprofessional - people notice hands', advice: 'Trim straight across, slightly rounded. File edges smooth. Clean under nails with brush. Keep them shorter than fingertips.', tools: 'Nail clippers, nail file, nail brush' },
      { id: 'selfcare-12', task: 'Clean and trim toenails (if needed)', priority: 'low', why: 'Prevents ingrown nails, fungus, and foot pain - comfort matters all day', advice: 'Cut straight across to prevent ingrown nails. Don\'t cut too short. Dry between toes completely after shower. Check for fungus weekly.', tools: 'Toenail clippers, towel, foot file' },
      { id: 'selfcare-13', task: 'Apply deodorant/antiperspirant', priority: 'high', why: 'Prevents body odor for 12+ hours - people respect those who smell good', advice: 'Apply to completely dry skin for best effectiveness. Use antiperspirant at night and morning. Apply to chest too if you sweat heavily.', tools: 'Deodorant or antiperspirant stick/spray' },
      { id: 'selfcare-14', task: 'Shave face/trim beard', priority: 'medium', why: 'Clean shave shows discipline and professionalism - commands respect', advice: 'Shave with the grain first, against for closer shave. Use sharp blades. Shave after shower when hair is soft. Rinse with cold water after.', tools: 'Razor/electric shaver, shaving cream/gel, aftershave' },
      { id: 'selfcare-15', task: 'Apply aftershave/cologne', priority: 'low', why: 'Signature scent creates memorable impressions and boosts confidence', advice: 'Less is more - 2-3 sprays maximum. Apply to pulse points: wrists, neck, chest. Don\'t rub wrists together. Spray 6 inches away from skin.', tools: 'Cologne or aftershave, possibly fragrance-free moisturizer' },
      { id: 'selfcare-16', task: 'Trim nose/ear hair (if needed)', priority: 'low', why: 'Details matter - groomed appearance shows you care about yourself', advice: 'Use rounded-tip scissors or electric trimmer. Only trim visible hair, don\'t go deep. Check in good lighting. Do this weekly.', tools: 'Nose hair trimmer or small scissors, mirror' },
      { id: 'selfcare-17', task: 'Apply lip balm', priority: 'low', why: 'Prevents cracked lips - healthy lips show vitality and health', advice: 'Apply after brushing teeth and before going outside. Reapply every 2-3 hours. Use SPF lip balm in sun. Don\'t lick lips - makes dryness worse.', tools: 'Lip balm with SPF' },
      { id: 'selfcare-18', task: 'Comb/style hair', priority: 'medium', why: 'Groomed hair shows self-respect - first thing people see is your head', advice: 'Use wide-tooth comb on wet hair. Style when slightly damp for best hold. Use minimal product - less is more. Have a consistent style.', tools: 'Comb or brush, hair product (gel/pomade), mirror' },
      { id: 'selfcare-19', task: 'Apply sunscreen (if applicable)', priority: 'medium', why: 'Prevents skin cancer and premature aging - protects your future self', advice: 'Use SPF 30+ minimum. Apply 15 minutes before sun exposure. Reapply every 2 hours outdoors. Don\'t forget ears, neck, and hands.', tools: 'Sunscreen SPF 30+' },
      { id: 'selfcare-20', task: 'Check skin for any issues', priority: 'low', why: 'Early detection saves lives - catch problems before they grow', advice: 'Look for new moles or changing spots. Check for redness, rashes, or unusual marks. Use mirror for back. See dermatologist annually.', tools: 'Mirror (full-length and handheld), good lighting' },
      { id: 'selfcare-21', task: 'Dress in clean, professional clothes', priority: 'high', why: 'You\'re the boss - dress like it. People follow leaders who look the part', advice: 'Iron shirts night before. Match belt with shoes. Dark colors look more authoritative. Ensure no stains, wrinkles, or loose threads.', tools: 'Clean clothes, iron, shoe polish, lint roller' },
      { id: 'selfcare-22', task: 'Put on socks and shoes', priority: 'high', why: 'Protected feet work all day - comfort affects your energy and mood', advice: 'Wear clean socks daily - prevents odor and fungus. Choose supportive shoes for long standing. Rotate shoes to extend life. Keep spare socks at work.', tools: 'Clean socks, comfortable shoes, shoe horn' },
      { id: 'selfcare-23', task: 'Apply body lotion (if dry skin)', priority: 'low', why: 'Healthy skin feels better and looks younger - prevents itching and cracking', advice: 'Apply right after shower while skin is damp. Focus on elbows, knees, and hands. Use unscented if you wear cologne. Apply daily in winter.', tools: 'Body lotion or moisturizer' },
      { id: 'selfcare-24', task: 'Clean ears (cotton swab exterior only)', priority: 'low', why: 'Clean ears prevent infections and waxy buildup - hygiene is health', advice: 'NEVER insert into ear canal - damages eardrum. Clean outer ear and behind ears only. Dry ears after shower. See doctor if excess wax.', tools: 'Cotton swabs, towel' },
      { id: 'selfcare-25', task: 'Take any morning vitamins/medications', priority: 'medium', why: 'Your body needs nutrients to perform - invest in your health daily', advice: 'Take with food to prevent nausea. Keep pills in visible spot so you don\'t forget. Set phone reminder. Track on calendar or app.', tools: 'Vitamins/medications, water, pill organizer' },
      { id: 'selfcare-26', task: 'Drink water (at least 8 oz)', priority: 'medium', why: 'Hydration boosts energy, focus, and metabolism - you\'ll feel sharper', advice: 'Drink room temperature for better absorption. Add lemon for vitamin C. Aim for half your body weight in ounces daily. Start day with water before coffee.', tools: 'Water bottle or glass, filtered water' },
      { id: 'selfcare-27', task: 'Quick stretch or breathing exercises', priority: 'low', why: 'Prepares your body and mind - reduces stress and increases alertness', advice: '5 deep breaths: inhale 4 counts, hold 4, exhale 4. Stretch neck, shoulders, and back. Touch toes. Reduces morning stiffness.', tools: 'Comfortable space, yoga mat (optional)' },
    ]
  },
  {
    title: "Opening (5:00 AM - 7:00 AM)",
    icon: Clock,
    color: "bg-orange-500",
    items: [
      { id: 'opening-1', task: 'Unlock and disarm security system', priority: 'high', why: 'First security check - ensures no overnight breaches, protects assets', advice: 'Check alarm panel for tamper alerts. Verify all zones before disarming. Note any unusual beeps or errors. Keep code confidential - change quarterly.', tools: 'Security code, flashlight, incident log' },
      { id: 'opening-2', task: 'Check overnight incident reports and surveillance footage', priority: 'high', why: 'Spot problems early - prevents liability and catches theft immediately', advice: 'Review last 8 hours at 4x speed. Focus on cash areas, fuel pumps, and perimeter. Save suspicious clips. Document all incidents in writing.', tools: 'DVR/NVR system, computer, incident report forms' },
      { id: 'opening-3', task: 'Verify cash registers and safe contents', priority: 'high', why: 'Confirms no shortages or theft - protects your profits and catches dishonesty', advice: 'Count starting cash twice for accuracy. Compare to closing report. Check bills for counterfeits. Document discrepancies immediately with witnesses.', tools: 'Cash drawer keys, safe combination, calculator, counterfeit pen' },
      { id: 'opening-4', task: 'Inspect fuel pumps and emergency shutoffs', priority: 'high', why: 'Safety first - prevents fires, explosions, and lawsuits that could destroy your business', advice: 'Test emergency shutoff button monthly. Check for fuel puddles or strong odors. Verify all nozzles hang properly. Report leaks to fire marshal immediately.', tools: 'Flashlight, absorbent pads, emergency contact list' },
      { id: 'opening-5', task: 'Check tank levels and order fuel if needed', priority: 'medium', why: 'Never run out of product - lost sales = lost money and angry customers', advice: 'Check levels at 25% remaining. Order 2-3 days ahead for delivery time. Track daily usage patterns. Have backup supplier for emergencies.', tools: 'Tank monitoring system, supplier contact info, order forms' },
      { id: 'opening-6', task: 'Walk the lot for cleanliness and safety hazards', priority: 'medium', why: 'Clean lot attracts customers - trash and hazards drive business away', advice: 'Pick up trash, check for broken glass. Ensure lights work. Look for trip hazards. Note needed repairs. Do this systematically - same route daily.', tools: 'Trash grabber, broom, dustpan, work gloves, notepad' },
      { id: 'opening-7', task: 'Review staff schedule and confirm coverage', priority: 'medium', why: 'Prevents chaos - short staffing kills customer service and burns out employees', advice: 'Call no-shows within 15 minutes of shift start. Have backup list ready. Cross-train employees. Post schedule 2 weeks ahead.', tools: 'Staff schedule, phone, contact list, time clock' },
    ]
  },
  {
    title: "Morning Operations (7:00 AM - 12:00 PM)",
    icon: TrendingUp,
    color: "bg-blue-500",
    items: [
      { id: 'morning-1', task: 'Hold brief team meeting - review daily goals', priority: 'medium', why: 'Aligned team wins - clear goals prevent confusion and boost performance', advice: 'Keep it under 10 minutes. Stand, don\'t sit. Focus on 3 priorities only. Ask for questions. Make it energizing, not boring.', tools: 'Meeting agenda, clipboard, daily goals sheet' },
      { id: 'morning-2', task: 'Check fuel pricing vs competitors, adjust if needed', priority: 'high', why: 'Price too high loses customers, too low loses profit - stay competitive', advice: 'Check 3 nearest competitors online or by driving by. Adjust within 0.05/gallon. Track price changes in spreadsheet. Know your break-even price.', tools: 'Competitor price app, pricing software, calculator, profit margin sheet' },
      { id: 'morning-3', task: 'Review sales reports from previous day', priority: 'medium', why: 'Data reveals trends - spot problems and opportunities before they grow', advice: 'Compare to last week same day. Look for anomalies. Check if promotions worked. Note bestsellers vs dead stock. Track weather impact.', tools: 'POS system, sales reports, spreadsheet, calculator' },
      { id: 'morning-4', task: 'Inspect convenience store inventory and merchandising', priority: 'medium', why: 'Empty shelves = lost sales - attractive displays increase impulse buys', advice: 'Face products forward. Check expiration dates. Put bestsellers at eye level. Rotate stock - first in, first out. Clean dusty packages.', tools: 'Inventory checklist, pricing gun, cleaning supplies, step stool' },
      { id: 'morning-5', task: 'Monitor rush hour traffic and pump efficiency', priority: 'low', why: 'Fast service = more customers - slow pumps cost you thousands daily', advice: 'Time average transaction from start to finish. Check for pump errors. Clear any payment issues immediately. Add staff if lines form.', tools: 'Stopwatch, pump status monitor, walkie-talkie' },
      { id: 'morning-6', task: 'Check restroom cleanliness (hourly spot checks)', priority: 'medium', why: 'Dirty bathrooms lose customers forever - cleanliness drives repeat business', advice: 'Check toilet paper, soap, paper towels. Wipe counters. Mop visible messes immediately. Use checklist on door. Hourly initials required.', tools: 'Cleaning checklist, supplies caddy, mop, disinfectant, air freshener' },
      { id: 'morning-7', task: 'Respond to emails and vendor communications', priority: 'low', why: 'Delays cost money - quick responses get better deals and solve problems faster', advice: 'Set aside 15 minutes for emails. Respond same day to urgent items. File systematically. Use templates for common responses. Unsubscribe from junk.', tools: 'Computer, email, phone, vendor contact list' },
    ]
  },
  {
    title: "Midday (12:00 PM - 3:00 PM)",
    icon: Users,
    color: "bg-green-500",
    items: [
      { id: 'midday-1', task: 'Conduct employee check-ins and performance observations', priority: 'medium', why: 'Catch issues early - coaching in the moment prevents bigger problems later', advice: 'Praise publicly, correct privately. Be specific about what you saw. Ask "how can I help you succeed?" Listen more than talk. Document conversations.', tools: 'Performance log, notepad, private office/area' },
      { id: 'midday-2', task: 'Review lunch shift transition and cash drawer exchanges', priority: 'high', why: 'Shift changes expose theft - tight controls protect your cash', advice: 'Both employees count together. Sign off on count sheet. Verify amounts match. Check for counterfeit bills. Lock up excess cash immediately.', tools: 'Cash count sheets, calculator, safe, counterfeit pen, witness' },
      { id: 'midday-3', task: 'Check food service compliance (if applicable)', priority: 'medium', why: 'Health violations shut you down - one inspection failure costs thousands', advice: 'Check food temperatures with thermometer. Verify hand washing compliance. Check dates on all perishables. Clean as you go. Follow health code checklist.', tools: 'Food thermometer, health code checklist, gloves, sanitizer' },
      { id: 'midday-4', task: 'Review loyalty program signups and promotions', priority: 'low', why: 'Repeat customers are profit - loyalty programs increase lifetime value 3x', advice: 'Track daily signup goals. Train staff to ask every customer. Offer instant rewards. Promote benefits on signage. Review redemption data weekly.', tools: 'Loyalty system, signup reports, promotional materials' },
      { id: 'midday-5', task: 'Inspect equipment: car wash, air pump, vacuum stations', priority: 'medium', why: 'Broken equipment = lost revenue - working amenities increase fuel sales', advice: 'Test each function. Check coin mechanisms. Look for damage. Post "out of order" immediately. Keep vendor repair numbers handy. Track downtime costs.', tools: 'Test coins/tokens, repair log, vendor contacts, tools, "out of order" signs' },
      { id: 'midday-6', task: 'Monitor inventory levels for fast-moving items', priority: 'low', why: 'Out of stock = frustrated customers - keep bestsellers always available', advice: 'Check top 20 sellers daily. Set reorder points. Order before you run out. Track seasonal patterns. Have backup suppliers for emergencies.', tools: 'Inventory system, reorder list, calculator, supplier contacts' },
    ]
  },
  {
    title: "Afternoon (3:00 PM - 6:00 PM)",
    icon: Fuel,
    color: "bg-purple-500",
    items: [
      { id: 'afternoon-1', task: 'Prepare for evening rush - ensure all pumps operational', priority: 'high', why: 'Evening rush is peak profit time - one broken pump costs hundreds per hour', advice: 'Test each pump. Clear error messages. Check receipt paper levels. Ensure card readers work. Have backup supplies ready. Add staff if needed.', tools: 'Pump diagnostic tools, receipt paper, card reader tester, cleaning supplies' },
      { id: 'afternoon-2', task: 'Check fuel delivery schedule and confirm next delivery', priority: 'medium', why: 'Running out of gas destroys reputation - customers won\'t come back', advice: 'Call supplier to confirm delivery time. Ensure space available for truck. Be present for delivery. Verify quantity on delivery ticket. Check for water in tanks.', tools: 'Delivery schedule, supplier phone number, tank stick, delivery log' },
      { id: 'afternoon-3', task: 'Review weekly P&L statements and budget variances', priority: 'medium', why: 'Numbers don\'t lie - spot overspending before it kills your margins', advice: 'Compare actual vs budget. Investigate variances over 10%. Look for unexpected costs. Identify cost-cutting opportunities. Update forecasts monthly.', tools: 'P&L statement, budget spreadsheet, calculator, highlighter' },
      { id: 'afternoon-4', task: 'Conduct safety walk-through and document findings', priority: 'high', why: 'Lawsuits bankrupt businesses - prevention is 100x cheaper than litigation', advice: 'Use standard checklist. Take photos of hazards. Fix critical items immediately. Schedule repairs for others. Keep documentation for insurance.', tools: 'Safety checklist, camera/phone, incident forms, repair log' },
      { id: 'afternoon-5', task: 'Meet with vendors or handle deliveries', priority: 'low', why: 'Good vendor relationships get better prices - save thousands annually', advice: 'Count inventory on delivery. Check for damage. Verify invoice matches delivery. Build rapport with reps. Negotiate payment terms. Get multiple quotes.', tools: 'Clipboard, invoice copies, calculator, pen, business cards' },
      { id: 'afternoon-6', task: 'Update training schedules and compliance certifications', priority: 'low', why: 'Untrained staff cause accidents - certifications protect you legally', advice: 'Track expiration dates. Schedule renewals 30 days ahead. Keep certificates posted. Document all training. OSHA compliance is non-negotiable.', tools: 'Training tracker, calendar, certificate copies, compliance binder' },
    ]
  },
  {
    title: "Evening (6:00 PM - 9:00 PM)",
    icon: DollarSign,
    color: "bg-yellow-500",
    items: [
      { id: 'evening-1', task: 'Supervise evening shift transition', priority: 'medium', why: 'Night shift needs clear handoff - confusion leads to errors and theft', advice: 'Written shift notes - never verbal only. Review key tasks. Introduce any issues. Verify night staff has all keys and codes. Clear communication prevents problems.', tools: 'Shift handoff log, keys, codes, task list, phone numbers' },
      { id: 'evening-2', task: 'Review daily sales performance and adjust targets', priority: 'medium', why: 'What gets measured gets improved - daily tracking compounds profits', advice: 'Compare to daily goal. Calculate variance percentage. Identify what worked. Plan tomorrow\'s focus. Celebrate wins with team. Course-correct quickly.', tools: 'Daily sales report, goal tracker, calculator, whiteboard' },
      { id: 'evening-3', task: 'Verify night shift staffing and security protocols', priority: 'high', why: 'Night shifts are high-risk - proper coverage prevents robberies and injuries', advice: 'Minimum 2 employees after dark. Verify panic button works. Review robbery procedures. Check door locks. Ensure phone accessible. Limit cash in drawer.', tools: 'Staff schedule, security checklist, panic button, locks, phone' },
      { id: 'evening-4', task: 'Check lighting - lot, canopy, signage all functional', priority: 'high', why: 'Dark stations attract crime and accidents - bright lights = safety and sales', advice: 'Replace burnt bulbs immediately. Check all areas after dark. Report electrical issues. Clean light covers monthly. Bright = safe. Document any issues.', tools: 'Flashlight, ladder, replacement bulbs, electrical tape, maintenance log' },
      { id: 'evening-5', task: 'Conduct cash office procedures and bank deposit prep', priority: 'high', why: 'Secure cash immediately - overnight theft is your responsibility', advice: 'Count in secure location. Use 2-person rule for large amounts. Verify deposit slip. Use tamper-evident bags. Vary deposit times. Bank before closing.', tools: 'Safe, cash bags, deposit slips, calculator, witness, security escort' },
      { id: 'evening-6', task: 'Review customer feedback and online reviews', priority: 'low', why: 'Bad reviews kill business - address complaints before they spread online', advice: 'Respond to reviews within 24 hours. Apologize for bad experiences. Fix systemic issues. Thank positive reviewers. Track complaint trends. Train staff on feedback.', tools: 'Computer, review sites (Google, Yelp), response templates, notepad' },
    ]
  },
  {
    title: "Night Security (9:00 PM - 12:00 AM)",
    icon: Shield,
    color: "bg-indigo-500",
    items: [
      { id: 'night-1', task: 'Final security check - cameras, alarms, perimeter', priority: 'high', why: 'Overnight security prevents thousands in losses - verify everything works', advice: 'Test all cameras - check blind spots. Verify alarm zones. Walk perimeter. Check locks on all doors. Ensure emergency exits clear. Test panic buttons.', tools: 'Camera monitor, alarm panel, flashlight, keys, perimeter checklist' },
      { id: 'night-2', task: 'Verify night staff understands emergency procedures', priority: 'high', why: 'Emergencies happen at night - trained staff can save lives and assets', advice: 'Quiz staff on robbery procedures. Review fire evacuation. Confirm emergency contacts. Practice using fire extinguisher. Ensure first aid accessible.', tools: 'Emergency procedures manual, first aid kit, fire extinguisher, contact list' },
      { id: 'night-3', task: 'Review incident log and address any issues', priority: 'medium', why: 'Unresolved issues escalate - fix small problems before they become crises', advice: 'Read all shift notes. Follow up on customer complaints. Investigate theft reports. Document actions taken. Forward serious issues to authorities.', tools: 'Incident log, notepad, camera access, phone, police non-emergency number' },
      { id: 'night-4', task: 'Plan next day priorities and staff assignments', priority: 'low', why: 'Planning tonight saves chaos tomorrow - start the day with clarity', advice: 'List top 3 priorities. Assign tasks to specific people. Note any deliveries. Plan for weather impacts. Review maintenance needs. Prep opening checklist.', tools: 'Planner, staff schedule, weather app, priority list, calendar' },
      { id: 'night-5', task: 'Set security system for overnight monitoring', priority: 'high', why: 'Armed security deters crime - one robbery costs more than years of monitoring', advice: 'Arm all zones. Test motion sensors. Verify monitoring company connection. Set up mobile alerts. Check battery backup. Document arming time.', tools: 'Security panel, code, phone app, backup key, monitoring company contact' },
    ]
  },
  {
    title: "Weekly/Strategic Tasks",
    icon: AlertCircle,
    color: "bg-red-500",
    items: [
      { id: 'weekly-1', task: 'Review weekly sales trends and KPIs', priority: 'medium', why: 'Trends reveal opportunities - weekly reviews let you pivot before losing momentum', advice: 'Track: sales, transactions, average ticket, fuel gallons. Compare week-over-week. Look for patterns. Identify growth opportunities. Set next week targets.', tools: 'Weekly reports, spreadsheet, graphs, calculator, highlighter' },
      { id: 'weekly-2', task: 'Conduct formal staff performance reviews', priority: 'medium', why: 'Good employees need feedback - reviews improve performance and reduce turnover', advice: 'Schedule 1-on-1 meetings. Prepare written feedback. Use examples. Set specific goals. Ask for their input. Document discussion. Follow up in 30 days.', tools: 'Performance review forms, employee files, goals worksheet, private office' },
      { id: 'weekly-3', task: 'Inspect and test fire safety equipment', priority: 'high', why: 'Gas stations are fire risks - working equipment saves lives and prevents lawsuits', advice: 'Test fire extinguishers monthly. Check dates. Verify emergency shutoff accessible. Test fire alarm. Ensure exit signs lit. Document all tests in log.', tools: 'Fire extinguisher checklist, testing gauge, alarm panel, maintenance log' },
      { id: 'weekly-4', task: 'Review and update emergency contact lists', priority: 'low', why: 'Emergencies need quick response - outdated contacts waste critical minutes', advice: 'Verify all numbers work. Add new staff immediately. Remove terminated employees. Post by each phone. Include: police, fire, poison control, utilities.', tools: 'Contact list template, phone, laminator, posted lists' },
      { id: 'weekly-5', task: 'Analyze competitor pricing and market trends', priority: 'medium', why: 'Market changes daily - staying informed keeps you competitive and profitable', advice: 'Visit competitors weekly. Note their prices, promotions, improvements. Read industry news. Join trade association. Network with other owners. Stay ahead.', tools: 'Competitor tracking sheet, industry publications, smartphone, notebook' },
      { id: 'weekly-6', task: 'Plan promotional campaigns and marketing initiatives', priority: 'low', why: 'Marketing drives traffic - promotions can double sales during slow periods', advice: 'Plan 2 weeks ahead. Use social media. Create urgency. Track results. Test different offers. Partner with local businesses. Build email list.', tools: 'Marketing calendar, social media, promotional materials, email software' },
      { id: 'weekly-7', task: 'Review insurance and compliance documentation', priority: 'medium', why: 'Compliance gaps risk fines and shutdown - stay current to stay in business', advice: 'Keep certificates current. File renewals 60 days early. Review coverage annually. Document all inspections. Keep binder accessible. Know your agent.', tools: 'Insurance binder, compliance checklist, calendar, agent contact info' },
    ]
  }
];