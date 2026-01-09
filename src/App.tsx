import { useState } from 'react';
import { TechStack, ProjectType, ChecklistSection } from './types';
import { ConditionSelector } from './components/ConditionSelector';
import { ChecklistSection as ChecklistSectionComponent } from './components/ChecklistSection';
import { CopyButton } from './components/CopyButton';
import { ThemeToggle } from './components/ThemeToggle';
import { getChecklistData } from './data/checklist';
import './App.css';

function App() {
  const [techStack, setTechStack] = useState<TechStack | null>(null);
  const [projectType, setProjectType] = useState<ProjectType | null>(null);
  const [checklistSections, setChecklistSections] = useState<ChecklistSection[]>([]);

  const updateChecklist = (stack: TechStack | null, type: ProjectType | null) => {
    // 条件に応じてチェックリストを更新（条件がなくても基本項目は表示）
    const data = getChecklistData(stack, type);
    setChecklistSections(data.sections);
  };

  const handleTechStackChange = (stack: TechStack | null) => {
    setTechStack(stack);
    updateChecklist(stack, projectType);
  };

  const handleProjectTypeChange = (type: ProjectType | null) => {
    setProjectType(type);
    updateChecklist(techStack, type);
  };

  const handleToggleItem = (sectionId: string, itemId: string) => {
    setChecklistSections((prevSections) =>
      prevSections.map((section) => {
        if (section.id !== sectionId) {
          return section;
        }
        
        // カテゴリーがある場合
        if (section.categories) {
          return {
            ...section,
            categories: section.categories.map((category) => ({
              ...category,
              items: category.items.map((item) =>
                item.id === itemId ? { ...item, checked: !item.checked } : item
              ),
            })),
          };
        }
        
        // カテゴリーがない場合（直接項目）
        if (section.items) {
          return {
            ...section,
            items: section.items.map((item) =>
              item.id === itemId ? { ...item, checked: !item.checked } : item
            ),
          };
        }
        
        return section;
      })
    );
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="header-text">
            <h1>公開前確認チェックリスト</h1>
            <p className="subtitle">
              公開可否を判断するための最低限の確認項目を条件に応じて表示します
            </p>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="app-main">
        <ConditionSelector
          techStack={techStack}
          projectType={projectType}
          onTechStackChange={handleTechStackChange}
          onProjectTypeChange={handleProjectTypeChange}
        />

        {checklistSections.length > 0 && (
          <div className="checklist-container">
            <div className="checklist-notice">
              <p>※ 本チェックは、公開可否判断のための最低限の確認です</p>
              <p>※ 網羅的な品質保証を目的としたものではありません</p>
            </div>
            
            <CopyButton sections={checklistSections} />
            
            <div className="checklist-sections">
              {checklistSections.map((section) => (
                <ChecklistSectionComponent
                  key={section.id}
                  section={section}
                  onToggleItem={handleToggleItem}
                />
              ))}
            </div>
          </div>
        )}

        {checklistSections.length === 0 && (
          <div className="empty-state">
            <p>条件を選択すると、確認項目が表示されます</p>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>本ツールは、公開可否判断のための最低限の確認項目を短時間で整理することを目的としています</p>
      </footer>
    </div>
  );
}

export default App;
