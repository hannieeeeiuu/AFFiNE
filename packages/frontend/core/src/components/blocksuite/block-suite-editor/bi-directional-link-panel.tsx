import { DocLinksService } from '@affine/core/modules/doc-link';
import { useI18n } from '@affine/i18n';
import {
  useLiveData,
  useServices,
  WorkspaceService,
} from '@toeverything/infra';
import { useCallback, useState } from 'react';

import { AffinePageReference } from '../../affine/reference-link';
import * as styles from './bi-directional-link-panel.css';

export const BiDirectionalLinkPanel = () => {
  const [show, setShow] = useState(false);
  const { docLinksService, workspaceService } = useServices({
    DocLinksService,
    WorkspaceService,
  });
  const t = useI18n();

  const links = useLiveData(docLinksService.links.links$);
  const backlinks = useLiveData(docLinksService.backlinks.backlinks$);
  const handleClickShow = useCallback(() => {
    setShow(!show);
  }, [show]);

  return (
    <div className={styles.container}>
      {!show && (
        <div className={styles.dividerContainer}>
          <div className={styles.divider}></div>
        </div>
      )}

      <div className={styles.titleLine}>
        <div className={styles.title}>Bi-Directional Links</div>
        <div className={styles.showButton} onClick={handleClickShow}>
          {show ? 'Hide' : 'Show'}
        </div>
      </div>

      {show && (
        <>
          <div className={styles.dividerContainer}>
            <div className={styles.divider}></div>
          </div>
          <div className={styles.linksContainer}>
            <div className={styles.linksTitles}>
              {t['com.affine.page-properties.backlinks']()} · {backlinks.length}
            </div>
            {backlinks.map(link => (
              <div key={link.docId} className={styles.link}>
                <AffinePageReference
                  key={link.docId}
                  pageId={link.docId}
                  docCollection={workspaceService.workspace.docCollection}
                />
              </div>
            ))}
          </div>
          <div className={styles.linksContainer}>
            <div className={styles.linksTitles}>
              {t['com.affine.page-properties.outgoing-links']()} ·{' '}
              {links.length}
            </div>
            {links.map((link, i) => (
              <div
                key={`${link.docId}-${link.params?.toString()}-${i}`}
                className={styles.link}
              >
                <AffinePageReference
                  pageId={link.docId}
                  params={link.params}
                  docCollection={workspaceService.workspace.docCollection}
                />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
