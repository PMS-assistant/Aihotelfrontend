/**
 * Legacy ConnectPage — all traffic is redirected to /integrations via the router.
 * This file is kept to satisfy the import in any remaining references.
 */
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

export default function ConnectPage() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/integrations', { replace: true });
  }, [navigate]);
  return null;
}
