import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useAuthContext } from 'context';
import classes from './styles.module.scss';
import { Domain as DomainType } from 'types';
import noImage from './no-image.png';
import {
  FaGlobe,
  FaNetworkWired,
  FaCloud,
  FaClock,
  FaBuilding,
  FaBolt
} from 'react-icons/fa';
import { ServicesTable, SSLInfo, WebInfo } from 'components';
import {
  Button,
  PrimaryNav,
  Menu,
  Search,
  NavMenuButton,
  Overlay,
  ModalContainer,
  Modal
} from '@trussworks/react-uswds';

export const Domain: React.FC = () => {
  const { domainId } = useParams();
  const { apiGet } = useAuthContext();
  const [domain, setDomain] = useState<DomainType>();
  const [showReviewModal, setShowReviewModal] = useState<Boolean>(false);

  const fetchDomain = useCallback(async () => {
    try {
      setDomain(undefined);
      const domain = await apiGet<DomainType>(`/domain/${domainId}`);
      setDomain(domain);
    } catch (e) {
      console.error(e);
    }
  }, [domainId, apiGet, setDomain]);

  useEffect(() => {
    fetchDomain();
  }, [fetchDomain]);

  return (
    <div className={classes.root}>
      <div className={classes.inner}>
        {domain && (
          <>
            <div className={classes.header}>
              <div className={classes.headerDetails}>
                <h1>{domain.name}</h1>
                <div className={classes.headerRow}>
                  <label>
                    <FaNetworkWired />
                    IP
                  </label>
                  <span>{domain.ip}</span>
                </div>

                <div className={classes.headerRow}>
                  <label>
                    <FaGlobe />
                    Location
                  </label>
                  <span>{domain.country}</span>
                </div>

                <div className={classes.headerRow}>
                  <label>
                    <FaCloud />
                    Cloud Hosted
                  </label>
                  <span>{domain.cloudHosted ? 'Yes' : 'No'}</span>
                </div>

                <div className={classes.headerRow}>
                  <label>
                    <FaBuilding />
                    Organization
                  </label>
                  <span>{domain.organization.name}</span>
                </div>

                <div className={classes.headerRow}>
                  <label>
                    <FaClock />
                    Passive Mode
                  </label>
                  <span>{domain.organization.isPassive ? 'Yes' : 'No'}</span>
                </div>
              </div>
              <div className={classes.imgWrapper}>
                <div style={{ float: 'right', marginBottom: '20px' }}>
                  <Button
                    type="button"
                    onClick={() => setShowReviewModal(true)}
                  >
                    Request Quick Review <FaBolt></FaBolt>
                  </Button>
                </div>
                <img
                  src={domain.screenshot || noImage}
                  alt={
                    domain.screenshot ? domain.name : 'no screenshot available'
                  }
                />
              </div>
            </div>
            {domain.services.length > 0 && (
              <div className={classes.section}>
                <h3>Ports and Services</h3>
                <ServicesTable services={domain.services} />
              </div>
            )}
            {domain.ssl && (
              <div className={classes.section}>
                <h3>SSL Certificate</h3>
                <SSLInfo {...domain.ssl} />
              </div>
            )}
            {domain.webTechnologies && (
              <div className={classes.section}>
                <h3>Known Web Technologies</h3>
                <WebInfo webTechnologies={domain.webTechnologies} />
              </div>
            )}
          </>
        )}
      </div>
      {showReviewModal && (
        <div>
          <Overlay />
          <ModalContainer>
            <Modal
              actions={
                <>
                  <Button
                    outline
                    type="button"
                    onClick={() => {
                      setShowReviewModal(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      setShowReviewModal(false);
                    }}
                  >
                    Request Review
                  </Button>
                </>
              }
              title={<h2>Request review?</h2>}
            >
              <p>
                This will request a quick 1-hour manual security review of this
                asset by CISA. By clicking "Submit", you opt in for CISA to
                review the asset and report any vulnerabilities found.
              </p>
            </Modal>
          </ModalContainer>
        </div>
      )}
    </div>
  );
};
