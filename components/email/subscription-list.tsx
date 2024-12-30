"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Mail, Clock, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import { EmailSubscription } from '@/lib/core/email/subscription/types';

interface SubscriptionListProps {
  subscriptions: EmailSubscription[];
  onUnsubscribe: (ids: string[]) => void;
  isUnsubscribing: boolean;
}

export function SubscriptionList({ 
  subscriptions, 
  onUnsubscribe,
  isUnsubscribing 
}: SubscriptionListProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? subscriptions.map(sub => sub.id) : []);
  };

  const handleSelect = (id: string, checked: boolean) => {
    setSelectedIds(prev => 
      checked ? [...prev, id] : prev.filter(selectedId => selectedId !== id)
    );
  };

  const handleUnsubscribe = () => {
    if (selectedIds.length === 0) return;
    onUnsubscribe(selectedIds);
    setSelectedIds([]);
    setShowConfirmDialog(false);
  };

  const getStatusIcon = (status: EmailSubscription['status']) => {
    switch (status) {
      case 'active':
        return <Mail className="h-4 w-4 text-green-500" />;
      case 'unsubscribing':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'failed':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'unsubscribed':
        return <CheckCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Email Subscriptions</CardTitle>
          <div className="flex items-center gap-4">
            <Checkbox
              checked={selectedIds.length === subscriptions.length}
              onCheckedChange={handleSelectAll}
            />
            <Button
              variant="destructive"
              size="sm"
              disabled={selectedIds.length === 0 || isUnsubscribing}
              onClick={() => setShowConfirmDialog(true)}
            >
              {isUnsubscribing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Unsubscribing...
                </>
              ) : (
                'Unsubscribe Selected'
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {subscriptions.map(subscription => (
              <div
                key={subscription.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <Checkbox
                    checked={selectedIds.includes(subscription.id)}
                    onCheckedChange={(checked) => 
                      handleSelect(subscription.id, checked as boolean)
                    }
                  />
                  <div>
                    <div className="font-medium">{subscription.sender}</div>
                    <div className="text-sm text-muted-foreground">
                      {subscription.domain}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Badge variant="outline">
                    {subscription.type}
                  </Badge>
                  <Badge>
                    {subscription.frequency}
                  </Badge>
                  {getStatusIcon(subscription.status)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Unsubscribe</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to unsubscribe from {selectedIds.length} email
              {selectedIds.length === 1 ? '' : 's'}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleUnsubscribe}>
              Unsubscribe
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}