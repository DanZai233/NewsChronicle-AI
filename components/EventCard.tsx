import React from 'react';
import { TimelineEvent } from '../types';
import { Calendar, Clock, Tag } from 'lucide-react';
import { motion } from 'framer-motion';

interface EventCardProps {
  event: TimelineEvent;
  index: number;
  isLeft: boolean;
}

export const EventCard: React.FC<EventCardProps> = ({ event, index, isLeft }) => {
  const sentimentColor = event.sentimentScore < 0 
    ? 'border-l-red-500' 
    : event.sentimentScore > 5 
      ? 'border-l-green-500' 
      : 'border-l-blue-500';
  
  const sentimentBg = event.sentimentScore < 0 
    ? 'bg-red-50' 
    : event.sentimentScore > 5 
      ? 'bg-green-50' 
      : 'bg-blue-50';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`relative mb-8 flex w-full md:justify-between items-center ${isLeft ? 'md:flex-row-reverse' : 'md:flex-row'}`}
    >
      {/* Desktop Spacer - Hidden on Mobile */}
      <div className="hidden md:block md:w-5/12"></div>
      
      {/* Timeline Dot */}
      {/* Mobile: Absolute at left-8 (32px). Centered horizontally on line. */}
      {/* Desktop: Static, centered naturally between flex items. */}
      <div className="absolute left-8 md:static md:left-auto transform -translate-x-1/2 md:translate-x-0 z-20 flex items-center justify-center bg-white shadow-xl w-10 h-10 rounded-full border-4 border-primary-100 shrink-0">
        <div className={`w-3 h-3 rounded-full ${event.sentimentScore < 0 ? 'bg-red-500' : 'bg-primary-500'}`}></div>
      </div>
      
      {/* Content Card */}
      {/* Mobile: Margin left to clear the dot. Flex-1 to take full width. */}
      {/* Desktop: Fixed width 5/12. No margin. */}
      <div className={`flex-1 ml-16 md:ml-0 md:flex-none md:w-5/12 px-6 py-4 rounded-xl shadow-md bg-white border-l-4 ${sentimentColor} hover:shadow-lg transition-shadow duration-300`}>
        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-1">
          <Calendar size={14} />
          <span className="font-medium">{event.date}</span>
          {event.time && (
            <>
              <span className="mx-1">•</span>
              <Clock size={14} />
              <span>{event.time}</span>
            </>
          )}
        </div>
        
        <h3 className="font-bold text-lg text-gray-900 mb-2 font-serif leading-tight">
          {event.title}
        </h3>
        
        <p className="text-gray-600 text-sm leading-relaxed mb-3">
          {event.description}
        </p>

        <div className="flex flex-wrap gap-2">
          {event.tags.map((tag, i) => (
            <span key={i} className={`text-xs px-2 py-1 rounded-full flex items-center font-medium ${sentimentBg}`}>
              <Tag size={10} className="mr-1 opacity-50" />
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};