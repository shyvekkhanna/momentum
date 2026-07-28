Build "Momentum" - An AI Powered Task Manager

You are a senior product designer and senior full-stack engineer.

Create a production-quality web application called Momentum.

This should NOT look like a typical boring todo app.

The UI should feel like a mix between:

Apple
Arc Browser
Things 3
Linear
Nintendo (small playful animations)

The application should be extremely smooth with premium animations.

Tech Stack

Use:

Next.js 16 App Router
TypeScript
Tailwind CSS v4
Framer Motion
shadcn/ui
Lucide Icons
React Hook Form
Zod
Local storage initially
Easily replaceable with Supabase later

Use the font:

Bricolage Grotesque

Design Language

The app should feel vibrant but minimal.

Rounded cards

Large spacing

Beautiful shadows

Glassmorphism where appropriate

Subtle gradients

Animated hover effects

Smooth transitions everywhere.

The application should run at 60fps.

Colour System

Each weekday has its own colour.

Monday
Deep Blue

Tuesday
Orange

Wednesday
Green

Thursday
Purple

Friday
Pink

Saturday
Yellow

Sunday
Red

Tasks inherit the colour of the day they belong to.

The colour should appear as:

left border
progress bar
badges
buttons
timeline markers

The app background should subtly adapt to the selected day's colour using a very soft gradient.

Dashboard

The home screen should show

Good Morning ☀️

Today's progress

Completion %

Tasks remaining

Upcoming tasks

Today's timeline

AI suggestions

Completed tasks

Quick Add button

Floating Action Button

Everything should animate into place.

Task Model

Each task contains

Task Name

Description (optional)

Date

Time

Importance

Priority options

🟢 Low

🟡 Medium

🟠 High

🔴 Critical

Estimated Duration

Task Category

Emoji

Completion status

Created time

Completion time

AI Features

Use AI throughout the application.

AI Scheduling

If the user enters

"Study French"

without a time,

AI should estimate

the best time.

Example reasoning:

French practice

30 minutes

Morning

or

Evening after work.

The user can accept or reject the suggestion.

AI Emoji Assignment

The app should intelligently assign emojis.

Examples

Buy groceries

🛒

Workout

🏋️

French

🇫🇷

Doctor

🩺

Meeting

💼

Laundry

🧺

Water plants

🪴

Pay bills

💳

Birthday

🎂

Coding

💻

Reading

📚

Cleaning

🧹

Movie

🎬

Flight

✈️

Gym

💪

Dog walk

🐕

Meditation

🧘

etc.

The emoji appears before the task title.

AI Shopping List

Later the application will have Shopping Lists.

Design the architecture now.

Shopping items should be automatically grouped.

Example

Milk

Butter

Cheese

↓

🥛 Dairy

Chicken

↓

🍗 Meat

Bananas

↓

🍌 Fruit

Tomatoes

↓

🥬 Vegetables

Soap

↓

🧼 Household

AI should also:

combine duplicates

suggest forgotten items

sort the list into store walking order

estimate price

Notifications

Browser notifications.

Ask permission on first launch.

Notify the user

5 minutes before every task.

If browser notifications aren't available, show an in-app notification.

Notifications should include

emoji

task title

time remaining

Example

🏋️ Gym starts in 5 minutes!

Postpone

Every task has

Postpone

When clicked

Show options

10 minutes

30 minutes

1 hour

Tomorrow

Next week

Custom Date & Time

The custom option opens a beautiful calendar and time picker.

Completion Animation

When a task is completed

A large floating coin appears.

Inspired by Mario.

Except

green

3D

glossy

contains a white checkmark

sparkles

slight rotation

bounce animation

shine sweep

coin flies upward

small particle explosion

then disappears.

The animation should feel satisfying.

Task Cards

Each task card should display

emoji

title

time

importance

duration

day colour

countdown

quick actions

complete

edit

delete

postpone

hover animation

Timeline View

Display the day as a timeline.

Current time indicator.

Tasks positioned according to time.

Animated progress line.

Calendar View

Monthly calendar.

Weekly calendar.

Colour-coded tasks.

Beautiful animations when changing months.

Statistics

Track

Tasks completed

Completion streak

Longest streak

Completion rate

Tasks per weekday

Most productive hours

Heatmap

Weekly summary

Monthly summary

Animated charts.

Search

Instant search.

Filter by

emoji

priority

weekday

date

completed

category

Dark Mode

Premium dark theme.

Deep charcoal.

Colourful accents remain vibrant.

Smooth animated switching.

Accessibility

Keyboard shortcuts

High contrast support

Screen reader friendly

Large click targets

Micro Animations

Buttons slightly compress.

Cards gently lift.

Checkbox springs.

Progress bars animate.

Numbers count upwards.

Hover glows.

Everything feels alive.

Empty States

When no tasks exist

Show an illustration.

Message

"Let's make today productive 🚀"

Quick Add button.

Architecture

Use clean component architecture.

Components should be reusable.

Keep AI utilities isolated.

Separate

UI

logic

storage

AI

notifications

animations

calendar

future shopping module

into dedicated folders.

Future Features

Design the architecture so these can be added later without major refactoring.

Recurring tasks

Natural language input

Voice input

Shared lists

Collaborative tasks

Google Calendar sync

Apple Calendar sync

Supabase

Authentication

Shopping Lists

Habit Tracker

Pomodoro Timer

AI productivity coach

Widgets

Mobile app

Final Goal

The application should feel so polished that it could genuinely be sold on the App Store.

Every interaction should delight the user.

Prioritize exceptional UX over flashy visuals.

Use tasteful animations, premium typography, excellent spacing, and consistent design throughout.