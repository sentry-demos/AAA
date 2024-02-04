import React, { useState, useMemo, useEffect } from 'react';
import './TableStyles.css'; // Import the stylesheet for styling
import sentryLogo from '../imgs/sentry.png'; 
import { findingsObj } from '../../dataGenerator';


const parseRecommendation = (recommendation) => {
  if (typeof recommendation !== 'string') {
    // Handle cases where recommendation is not a string
    return {
      text: '',
      link: null
    };
  }

  // Function to replace placeholders with values from findingsObj
  const replacePlaceholders = (text) => {
    return text.replace(/\{([^}]+)\}/g, (match, key) => {
      // Replace with value from findingsObj if available, else keep original placeholder
      return findingsObj[key] ?? match;
    });
  };

  const match = recommendation.match(/\| (.+)$/);

  if (match) {
    const [fullMatch, link] = match;
    const sanitizedLink = replacePlaceholders(link.trim());
    return {
      text: replacePlaceholders(recommendation.replace(fullMatch, '')),
      link: sanitizedLink,
    };
  }

  return {
    text: replacePlaceholders(recommendation),
    link: null,
  };
};

const dateNow = new Date().toLocaleDateString('en-US', {
  month: '2-digit',
  day: '2-digit',
  year: 'numeric'
});

const ExpandingRow = React.memo(({ row, updateScore, isHovered, onCellHover, onCellLeave, hoverColor }) => {
  useEffect(() => {
    if (row.original.value === 'true') {
      updateScore(true);
    }
  }, [row.original.value, updateScore]);

  const recommendationData = parseRecommendation(row.original.recommendation);

  return (
    <div className="expanded-row">
      <h2 className="section-title">{row.original.key}
               {/* <span style={{ marginLeft: '5px' }}>
           {row.original.tag === "developer-productivity" && <DeveloperProductivityTag color="#0e8c93" text="Developer Productivity" />}
          {row.original.tag === "developer-happiness" && <DeveloperProductivityTag text="Developer-Happiness" color="pink" />}
         </span>         */}
      </h2>
      <div className="section-content">{row.original.explanation}</div>
      <div className="recommendation">
        <strong>Recommendation:</strong>{' '}
        {recommendationData.link ? (
          <a href={recommendationData.link} target="_blank" rel="noopener noreferrer">
            {recommendationData.text}
          </a>
        ) : (
          recommendationData.text
        )}
      </div>
    </div>
  );
});

const ProjectTable = ({ data, updateScore }) => {
  const [hoveredRow, setHoveredRow] = useState(null);
  const [hoverColor, setHoverColor] = useState('blue');

  const handleCellHover = (rowId) => {
    setHoveredRow(rowId);
  };

  const handleCellLeave = () => {
    setHoveredRow(null);
  };

  return (
    <div className="project-table">
      {data.map((row, rowIndex) => (
        <ExpandingRow
          key={rowIndex}
          row={{ original: row }}
          updateScore={updateScore}
          isHovered={rowIndex === hoveredRow}
          onCellHover={() => handleCellHover(rowIndex)}
          onCellLeave={handleCellLeave}
          hoverColor={hoverColor}
        />
      ))}
    </div>
  );
};

const TableContainer = () => {
  const [score, setScore] = useState(0);

  const updateScore = (isTrue) => {
    if (isTrue) {
      setScore((prevScore) => Math.min(prevScore + 5, 100));
    }
  };

  const data = useMemo(
    () => {
      return Object.entries(findingsObj)
        .filter(([key]) => key !== "Org Slug" && key !== "Project Name")
        .map(([key, value]) => ({
          key,
          value: value && value.value != null ? value.value.toString() : '',
          explanation: value ? value.explanation : '',
          recommendation: value ? value.recommendation : '',
          tag: value ? value.tag : '',
        }));
    },
    []
  );

  const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    // justifyContent: 'center',
    textAlign: 'center',
  };

  return (
    
    <div className="table-container">
      <div>
      <div style={containerStyle}>
        <img
          src={sentryLogo} // Replace with the actual path to your Sentry.io logo
          alt="Sentry.io Logo"
          style={{ width: '30px', marginRight: '10px' }}
        />
        <h1 className="mainHeader" style={{ textAlign: 'center' }}>
          Project Recommendations  
        </h1>
        <span style={{ marginLeft: 'auto' }}>Generated on {dateNow}</span>
      </div>
      <span><strong>Org Slug:</strong> {findingsObj["Org Slug"]}</span>
      <br></br>
      <span><strong>Project Name:</strong> {findingsObj["Project Name"]}</span>
      <p>
        <li>This report lists useful features included in your current plan but not yet set up.</li>
        <li>See the descriptions and <strong>recommendation links</strong>  for why & how to get configured.</li>  
      </p>

      <br></br>
    </div>
      <h1 className="table-heading">Project Recommendations</h1>
      <ProjectTable data={data} updateScore={updateScore} />
    </div>
  );
};

export default TableContainer;
