import React from 'react';
import * as commonStyles from '../../styles/common/common.module.css';

const RiderTabs = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className={commonStyles.tabsContainer}>
      <div className={commonStyles.tabButtons}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`${commonStyles.tabButton} ${activeTab === tab.id ? commonStyles.tabActive : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className={commonStyles.tabContent}>
        {tabs.find(tab => tab.id === activeTab)?.content}
      </div>
    </div>
  );
};

export default RiderTabs;