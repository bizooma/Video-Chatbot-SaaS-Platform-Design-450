import React, { useState } from 'react';
import { FeedbackWorkflow } from '@questlabs/react-sdk';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import questConfig from '../questConfig';

const FeedbackButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      {/* Floating Feedback Button */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        style={{ background: questConfig.PRIMARY_COLOR }}
        className="flex gap-1 rounded-t-md rounded-b-none justify-end items-center px-3 text-14 leading-5 font-semibold py-2 text-white z-50 fixed top-[calc(50%-20px)] -right-10 rotate-[270deg] transition-all h-9"
      >
        <div className="w-fit h-fit rotate-90 transition-all duration-300">
          <SafeIcon icon={FiIcons.FiMessageCircle} />
        </div>
        <p className="text-white text-sm font-medium leading-none">Feedback</p>
      </button>

      {/* Feedback Workflow Component */}
      {isOpen && (
        <FeedbackWorkflow
          uniqueUserId={localStorage.getItem('userId') || questConfig.USER_ID}
          questId={questConfig.QUEST_FEEDBACK_QUESTID}
          isOpen={isOpen}
          accent={questConfig.PRIMARY_COLOR}
          onClose={() => setIsOpen(false)}
        >
          <FeedbackWorkflow.ThankYou />
        </FeedbackWorkflow>
      )}
    </>
  );
};

export default FeedbackButton;